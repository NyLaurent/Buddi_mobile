import AdminProfileReviewCard from "@/components/admin/AdminProfileReviewCard";
import AdminVideoReviewCard from "@/components/admin/AdminVideoReviewCard";
import CoverageAlertCard from "@/components/admin/CoverageAlertCard";
import ParentRequestCard from "@/components/admin/ParentRequestCard";
import AnalyticsCard from "@/components/commons/AnalyticsCard";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
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

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

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
          }}
          className="px-2 pt-3"
        >
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={<Ionicons name="flash" size={36} color="#3BC3FF" />}
              title="Total Buddis"
              value="12"
              subtitle="2 Schools"
            />
          </View>
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={
                <MaterialCommunityIcons name="cash" size={36} color="#7B61FF" />
              }
              title="Pending Payments"
              value="3"
              subtitle="All time"
            />
          </View>
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={<Ionicons name="people" size={36} color="#FF5A7D" />}
              title="Registered Parents"
              value="3"
              subtitle="Connected"
            />
          </View>
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={<Ionicons name="person" size={36} color="#A259FF" />}
              title="Pending Buddi Applications"
              value="2"
              subtitle="2 Schools"
            />
          </View>
        </View>

        <View>
          <CoverageAlertCard
            title="21 Buddis Need Coverage For Today"
            subtitle="Review this before effects!"
            description="Please review Buddis requesting coverage to ensure availability and reliability."
            primaryButton={{
              label: "Handle Coverages",
              icon: <Ionicons name="reload" size={20} color="#fff" />,
              onPress: () => {
                router.push("/admin/buddis" as any);
              },
            }}
          />
          <CoverageAlertCard
            title="New Buddi Applications Pending"
            subtitle="8 applications require review"
            description="Review new Buddi applications and references to maintain platform quality."
            secondaryButton={{
              label: "View All",
              icon: <Ionicons name="eye-outline" size={20} color="#23272F" />,
              onPress: () => {
                /* handle deploy */
              },
            }}
            primaryButton={{
              label: "Review Now",
              icon: <Ionicons name="person-outline" size={20} color="#fff" />,
              onPress: () => {
                router.push("/admin/buddis" as any);
              },
            }}
          />
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
              onPress={() => {
                router.push("/admin/parents" as any);
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
            contentContainerStyle={styles.parentRequestsContainer}
          >
            <ParentRequestCard
              date="MAR 05"
              serviceType="Pickup & Baby Sitting"
              duration="2hrs per Day"
              parentName="Brian Ford"
              parentEmail="brianford@lok.com"
              parentAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
              onProposeBuddis={() => {
                router.push("/admin/buddis" as any);
              }}
            />
            <ParentRequestCard
              date="MAR 05"
              serviceType="Pickup & Baby Sitting"
              duration="2hrs per Day"
              parentName="Brian Ford"
              parentEmail="brianford@lok.com"
              parentAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
              onProposeBuddis={() => {
                router.push("/admin/buddis" as any);
              }}
            />
            <ParentRequestCard
              date="MAR 06"
              serviceType="School Pickup"
              duration="1hr per Day"
              parentName="Sarah Johnson"
              parentEmail="sarah.j@email.com"
              parentAvatar="https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150"
              onProposeBuddis={() => {
                router.push("/admin/buddis" as any);
              }}
            />
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
});
