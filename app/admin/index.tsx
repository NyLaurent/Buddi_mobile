import AdminProfileReviewCard from "@/components/admin/AdminProfileReviewCard";
import AdminVideoReviewCard from "@/components/admin/AdminVideoReviewCard";
import CoverageAlertCard from "@/components/admin/CoverageAlertCard";
import ParentRequestCard from "@/components/admin/ParentRequestCard";
import AnalyticsCard from "@/components/commons/AnalyticsCard";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import ParentService, {
  ParentPickupRequest,
  ParentRecord,
} from "../../services/api/parent.service";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [parentRequests, setParentRequests] = useState<ParentPickupRequest[]>(
    []
  );
  const [parents, setParents] = useState<ParentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a mapping of parentId to parent name
  const getParentName = (parentId: string) => {
    console.log("Looking for parentId:", parentId);
    console.log("Available parents:", parents.length);

    const parent = parents.find((p) => p.userId === parentId);
    console.log("Found by userId:", parent);

    if (parent?.User) {
      const fullName = `${parent.User.firstName} ${parent.User.lastName}`;
      console.log("Returning name:", fullName);
      return fullName;
    }

    // If no parent found, try to find by id as well
    const parentById = parents.find((p) => p.id === parentId);
    console.log("Found by id:", parentById);

    if (parentById?.User) {
      const fullName = `${parentById.User.firstName} ${parentById.User.lastName}`;
      console.log("Returning name by id:", fullName);
      return fullName;
    }

    console.log("No parent found, returning fallback");
    return `Parent ${parentId.slice(0, 8)}`;
  };

  const getParentEmail = (parentId: string) => {
    const parent = parents.find((p) => p.userId === parentId);
    if (parent?.User?.email) {
      return parent.User.email;
    }
    // If no parent found, try to find by id as well
    const parentById = parents.find((p) => p.id === parentId);
    if (parentById?.User?.email) {
      return parentById.User.email;
    }
    return `parent${parentId.slice(0, 8)}@example.com`;
  };

  const fetchParentRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ParentService.getAllParentRequests(1, 10);
      setParentRequests(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch parent requests");
      console.error("Error fetching parent requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParents = async () => {
    try {
      const response = await ParentService.getAllParents(1, 100); // Get more parents to ensure we have all
      setParents(response.data);
      console.log("Fetched parents data:", response.data);
      console.log("Sample parent:", response.data[0]);
    } catch (err: any) {
      console.error("Error fetching parents:", err);
    }
  };

  useEffect(() => {
    fetchParentRequests();
    fetchParents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      })
      .toUpperCase();
  };

  const formatTime = (time: string) => {
    if (time.includes(":")) {
      return time;
    }
    return time;
  };

  const getServiceType = (description: string) => {
    if (description.toLowerCase().includes("pickup")) {
      return "School Pickup";
    }
    return "Pickup Service";
  };

  const getDuration = (availableDays: string[]) => {
    return `${availableDays.length} days per week`;
  };

  const calculateAnalytics = () => {
    const totalRequests = parentRequests.length;
    const pendingRequests = parentRequests.filter(
      (req) => req.status === "pending"
    ).length;
    const matchedRequests = parentRequests.filter(
      (req) => req.status === "matched"
    ).length;
    const completedRequests = parentRequests.filter(
      (req) => req.status === "completed"
    ).length;

    return {
      totalRequests,
      pendingRequests,
      matchedRequests,
      completedRequests,
    };
  };

  const analytics = calculateAnalytics();

  const handleLogout = () => {
    console.log("Logout button clicked!"); // Debug log
    // Show confirmation modal before logout
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: handleLogoutConfirmed },
    ]);
  };

  const handleLogoutConfirmed = async () => {
    console.log("User confirmed logout"); // Debug log
    try {
      console.log("Calling logout function..."); // Debug log
      await logout();
      console.log("Logout successful, navigating to login..."); // Debug log
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error); // Debug log
      // For web, use window.alert as fallback
      if (typeof window !== "undefined") {
        window.alert("Failed to logout. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 24,
          }}
        >
          <View>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[75px] h-[40px]"
              resizeMode="contain"
            />
            {user && (
              <>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 20,
                    color: "#FF932E",
                    marginTop: 8,
                    marginBottom: 2,
                    letterSpacing: 0.2,
                  }}
                >
                  Welcome,{" "}
                  <Text style={{ color: "#232B3A" }}>{user.firstName}</Text>
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 14,
                    color: "#6B7280",
                    marginBottom: 2,
                  }}
                >
                  Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Text>
              </>
            )}
          </View>
          <View className="flex-row items-center gap-2 pr-1">
            <TouchableOpacity className="p-2 bg-primary rounded-xl shadow-sm">
              <Ionicons name="search-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-primary rounded-xl shadow-sm">
              <Ionicons name="notifications-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 bg-red-500 rounded-xl shadow-sm"
              onPress={() => {
                console.log("TouchableOpacity pressed!"); // Simple test
                handleLogout();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 16,
            paddingHorizontal: 16,
            paddingTop: 12,
          }}
        >
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={<Ionicons name="flash" size={36} color="#3BC3FF" />}
              title="Total Requests"
              value={analytics.totalRequests.toString()}
              subtitle="All time"
            />
          </View>
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={
                <MaterialCommunityIcons name="cash" size={36} color="#7B61FF" />
              }
              title="Pending Requests"
              value={analytics.pendingRequests.toString()}
              subtitle="Need attention"
            />
          </View>
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={<Ionicons name="people" size={36} color="#FF5A7D" />}
              title="Matched Requests"
              value={analytics.matchedRequests.toString()}
              subtitle="Successfully matched"
            />
          </View>
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={<Ionicons name="person" size={36} color="#A259FF" />}
              title="Completed Requests"
              value={analytics.completedRequests.toString()}
              subtitle="Finished"
            />
          </View>
        </View>

       

        {/* Profile Reviews Section */}
        <View style={styles.profileReviewsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Reviews</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => {
                router.push("/admin/buddis" as any);
              }}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FF932E"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.profileReviewsContainer}
          >
            <AdminProfileReviewCard
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
              name="Brian F"
              email="sarah.j@email.com"
              phone="+1 (555) 123-4567"
              date="Dec 15, 2024"
              time="2:30 PM"
              onReview={() => {
                router.push("/admin/buddis" as any);
              }}
            />
            <AdminProfileReviewCard
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
              name="Michael Chen"
              email="m.chen@email.com"
              phone="+1 (555) 987-6543"
              date="Dec 14, 2024"
              time="10:15 AM"
              onReview={() => {
                router.push("/admin/buddis" as any);
              }}
            />
            <AdminProfileReviewCard
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
              name="Emma Wilson"
              email="emma.w@email.com"
              phone="+1 (555) 456-7890"
              date="Dec 13, 2024"
              time="4:45 PM"
              onReview={() => {
                router.push("/admin/buddis" as any);
              }}
            />
          </ScrollView>
        </View>

        {/* Pending Profile Videos Reviews Section */}
        <View style={styles.videoReviewsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Pending Profile Videos Reviews
            </Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => {
                router.push("/admin/buddis" as any);
              }}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FF932E"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.videoListContainer}>
            <AdminVideoReviewCard
              name="John Doe"
              date="23, May, 2025"
              time="2:01 pm"
              duration="00:40:05"
              onViewVideo={() => {
                router.push("/admin/buddis" as any);
              }}
              onPlayVideo={() => {
                // Play the intro video
                console.log("Playing intro.mp4");
              }}
            />
            <AdminVideoReviewCard
              name="John Doe"
              date="23, May, 2025"
              time="2:01 pm"
              duration="00:40:05"
              onViewVideo={() => {
                router.push("/admin/buddis" as any);
              }}
              onPlayVideo={() => {
                // Play the intro video
                console.log("Playing intro.mp4");
              }}
            />
            <AdminVideoReviewCard
              name="John Doe"
              date="23, May, 2025"
              time="2:01 pm"
              duration="00:40:05"
              onViewVideo={() => {
                router.push("/admin/buddis" as any);
              }}
              onPlayVideo={() => {
                // Play the intro video
                console.log("Playing intro.mp4");
              }}
            />
          </View>
        </View>

        {/* Parent Requests Section */}
        <View style={styles.parentRequestsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Parent Requests</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push("/admin/parent-requests" as any)}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#FF932E" />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.parentRequestsContainer}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FF932E" />
                <Text style={styles.loadingText}>Loading requests...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={fetchParentRequests}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : parentRequests.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No parent requests found.</Text>
              </View>
            ) : (
              parentRequests.slice(0, 3).map((request, index) => (
                <ParentRequestCard
                  key={request.id}
                  date={formatDate(request.createdAt)}
                  serviceType={getServiceType(request.description)}
                  duration={getDuration(request.availableDays)}
                  parentName={getParentName(request.parentId)}
                  parentEmail={getParentEmail(request.parentId)}
                  parentAvatar={undefined}
                  onProposeBuddis={() => {
                    router.push({
                      pathname: "/admin/request-details/[id]",
                      params: { id: request.id.toString() },
                    });
                  }}
                />
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    margin: 16,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 16,
    color: "#FF932E",
    fontFamily: "Comfortaa-Regular",
  },
  activityCard: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 10,
  },
  noActivity: {
    color: "#666",
    textAlign: "center",
  },
  profileReviewsSection: {
    paddingLeft: 8,
  },
  profileReviewsContainer: {
    padding: 2,
  },
  videoReviewsSection: {
    paddingLeft: 8,
    marginTop: 24,
  },
  videoListContainer: {
    paddingHorizontal: 2,
  },
  parentRequestsSection: {
    paddingLeft: 8,
    marginTop: 24,
  },
  parentRequestsContainer: {
    padding: 2,
  },
  loadingContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  errorText: {
    color: "#FF5A7D",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#FF932E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Comfortaa-Bold",
  },
  emptyContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
});
