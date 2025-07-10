import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ParentRequestCard from "../../components/admin/ParentRequestCard";
import { useAuth } from "../../context/AuthContext";
import ParentService, {
  ParentPickupRequest,
  ParentRecord,
} from "../../services/api/parent.service";

export default function ParentRequestsScreen() {
  const [requests, setRequests] = useState<ParentPickupRequest[]>([]);
  const [parents, setParents] = useState<ParentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "matched">(
    "all"
  );

  const router = useRouter();
  const { user } = useAuth();

  // Create a mapping of parentId to parent name
  const getParentName = (parentId: string) => {
    const parent = parents.find((p) => p.userId === parentId);
    if (parent?.User) {
      return `${parent.User.firstName} ${parent.User.lastName}`;
    }
    // If no parent found, try to find by id as well
    const parentById = parents.find((p) => p.id === parentId);
    if (parentById?.User) {
      return `${parentById.User.firstName} ${parentById.User.lastName}`;
    }
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

  const fetchRequests = async (
    page: number = 1,
    isRefresh: boolean = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await ParentService.getAllParentRequests(page, 4);
      let filteredRequests = response.data;

      // Filter based on active tab
      if (activeTab === "pending") {
        filteredRequests = response.data.filter(
          (req) => req.status === "pending"
        );
      } else if (activeTab === "matched") {
        filteredRequests = response.data.filter(
          (req) => req.status === "matched"
        );
      }

      setRequests(filteredRequests);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalRecords(filteredRequests.length);
    } catch (err: any) {
      setError(err.message || "Failed to fetch parent requests");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchParents = async () => {
    try {
      const response = await ParentService.getAllParents(1, 100); // Get more parents to ensure we have all
      setParents(response.data);
    } catch (err: any) {
      console.error("Error fetching parents:", err);
    }
  };

  useEffect(() => {
    fetchRequests(1);
    fetchParents();
  }, [activeTab]);

  const handleRefresh = () => {
    fetchRequests(1, true);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !loading) {
      fetchRequests(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1 && !loading) {
      fetchRequests(currentPage - 1);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleTabPress = (tab: "all" | "pending" | "matched") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      })
      .toUpperCase();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF932E";
      case "matched":
        return "#34C759";
      case "completed":
        return "#0A77FF";
      default:
        return "#FF932E";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "matched":
        return "Matched";
      case "completed":
        return "Completed";
      default:
        return "Pending";
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Parent Requests</Text>
        <Text style={styles.headerSubtitle}>
          {totalRecords} requests • Page {currentPage} of {totalPages}
        </Text>
      </View>
    </View>
  );

  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "all" && styles.activeTab]}
        onPress={() => handleTabPress("all")}
      >
        <Text
          style={[styles.tabText, activeTab === "all" && styles.activeTabText]}
        >
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "pending" && styles.activeTab]}
        onPress={() => handleTabPress("pending")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "pending" && styles.activeTabText,
          ]}
        >
          Pending
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "matched" && styles.activeTab]}
        onPress={() => handleTabPress("matched")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "matched" && styles.activeTabText,
          ]}
        >
          Matched
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (loading && requests.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF932E" />
          <Text style={styles.loadingText}>Loading parent requests...</Text>
        </View>
      );
    }

    if (error && requests.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF932E" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchRequests(1)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (requests.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="document-text" size={48} color="#FF932E" />
          <Text style={styles.emptyTitle}>No Requests Found</Text>
          <Text style={styles.emptyText}>
            There are currently no parent requests available.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.requestsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {requests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <ParentRequestCard
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
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(request.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(request.status) },
                  ]}
                >
                  {getStatusText(request.status)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.paginationButtonDisabled,
              ]}
              onPress={handlePreviousPage}
              disabled={currentPage === 1 || loading}
            >
              <Ionicons
                name="chevron-back"
                size={16}
                color={currentPage === 1 ? "#ccc" : "#FF932E"}
              />
              <Text
                style={[
                  styles.paginationButtonText,
                  currentPage === 1 && styles.paginationButtonTextDisabled,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.pageInfo}>
              <Text style={styles.pageInfoText}>
                Page {currentPage} of {totalPages}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.paginationButtonDisabled,
              ]}
              onPress={handleNextPage}
              disabled={currentPage === totalPages || loading}
            >
              <Text
                style={[
                  styles.paginationButtonText,
                  currentPage === totalPages &&
                    styles.paginationButtonTextDisabled,
                ]}
              >
                Next
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={currentPage === totalPages ? "#ccc" : "#FF932E"}
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      {renderTabNavigation()}
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#333",
  },
  headerSubtitle: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  filterButton: {
    padding: 8,
  },
  requestsContainer: {
    paddingTop: 8,
    paddingBottom: 20,
    alignItems: "center" as const,
  },
  requestCard: {
    marginBottom: 16,
    width: "90%" as any, // Center the cards
  },
  statusContainer: {
    position: "absolute" as const,
    top: 16,
    left: 16,
    zIndex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  errorTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#333",
    marginTop: 16,
    textAlign: "center" as const,
  },
  errorText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center" as const,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#FF932E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  retryButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#fff",
  },
  emptyTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#333",
    marginTop: 16,
    textAlign: "center" as const,
  },
  emptyText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center" as const,
    lineHeight: 20,
  },
  paginationContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    width: "90%" as any,
    alignSelf: "center" as any,
  },
  paginationButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF932E",
  },
  paginationButtonDisabled: {
    borderColor: "#e9ecef",
    backgroundColor: "#f8f9fa",
  },
  paginationButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#FF932E",
    marginHorizontal: 4,
  },
  paginationButtonTextDisabled: {
    color: "#ccc",
  },
  pageInfo: {
    alignItems: "center" as const,
  },
  pageInfoText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#FF932E",
    borderRadius: 20,
  },
  tabText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
};
