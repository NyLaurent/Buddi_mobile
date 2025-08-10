import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import AvailableCallCard from "../../components/commons/AvailableCallCard";
import ApplyModal from "../../components/modals/ApplyModal";
import { useAuth } from "../../context/AuthContext";
import BuddiService, { AvailableCall } from "../../services/api/buddi.service";

export default function AvailableCallsScreen() {
  const [calls, setCalls] = useState<AvailableCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(5); // This matches the API's pageSize
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCallId, setSelectedCallId] = useState<number | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  const fetchCalls = async (page: number = 0, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await BuddiService.getAvailableCalls(page, limit);

      setCalls(response.data);
      setTotalRecords(response.totalItems);
      setCurrentPage(response.currentPage - 1); // Convert 1-based to 0-based for UI
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pickup requests");
      console.error("Error fetching calls:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCalls(0);
  }, []);

  const handleRefresh = () => {
    fetchCalls(currentPage, true);
  };

  const handleApplyPress = (callId: number) => {
    setSelectedCallId(callId);
    setShowApplyModal(true);
  };

  const handleModalClose = () => {
    setShowApplyModal(false);
    setSelectedCallId(null);
  };

  const handleApplicationSuccess = () => {
    // Optionally refresh the calls list
    fetchCalls(currentPage, true);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchCalls(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchCalls(currentPage - 1);
    }
  };

  const handleViewDetails = (callId: number) => {
    router.push({
      pathname: "/buddi/call-details/[id]",
      params: { id: callId.toString() },
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Available Pickup Requests</Text>
        <Text style={styles.headerSubtitle}>
          {totalRecords} pending requests available • Page {currentPage + 1} of{" "}
          {totalPages}
        </Text>
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <FontAwesome5 name="filter" size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (loading && calls.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF932E" />
          <Text style={styles.loadingText}>
            Loading available pickup requests...
          </Text>
        </View>
      );
    }

    if (error && calls.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome5 name="exclamation-triangle" size={48} color="#FF932E" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchCalls(0)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (calls.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome5 name="hand-holding-heart" size={48} color="#FF932E" />
          <Text style={styles.emptyTitle}>No Pending Pickup Requests</Text>
          <Text style={styles.emptyText}>
            There are currently no pending pickup requests available. Check back
            later!
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.callsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {calls.map((call) => (
          <AvailableCallCard
            key={call.id}
            call={call}
            onApplyPress={handleApplyPress}
            onViewDetails={handleViewDetails}
          />
        ))}
      </ScrollView>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 0 && styles.paginationButtonDisabled,
          ]}
          onPress={handlePreviousPage}
          disabled={currentPage === 0}
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={currentPage === 0 ? "#ccc" : "#FF932E"}
          />
          <Text
            style={[
              styles.paginationButtonText,
              currentPage === 0 && styles.paginationButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.pageInfo}>
          <Text style={styles.pageInfoText}>
            Page {currentPage + 1} of {totalPages}
          </Text>
          
        </View>

        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages - 1 && styles.paginationButtonDisabled,
          ]}
          onPress={handleNextPage}
          disabled={currentPage === totalPages - 1}
        >
          <Text
            style={[
              styles.paginationButtonText,
              currentPage === totalPages - 1 &&
                styles.paginationButtonTextDisabled,
            ]}
          >
            Next
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={currentPage === totalPages - 1 ? "#ccc" : "#FF932E"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      {renderContent()}
      {renderPagination()}

      <ApplyModal
        visible={showApplyModal}
        onClose={handleModalClose}
        callId={selectedCallId || 0}
        onSuccess={handleApplicationSuccess}
      />
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
  callsContainer: {
    paddingTop: 8,
    paddingBottom: 20,
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
};
