import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvailableCallCard from "../../components/commons/AvailableCallCard";
import { useAuth } from "../../context/AuthContext";
import BuddiService, { AvailableCall } from "../../services/api/buddi.service";

export default function AvailableCallsScreen() {
  const [calls, setCalls] = useState<AvailableCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const router = useRouter();
  const { user } = useAuth();

  const fetchCalls = async (page: number = 1, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await BuddiService.getAvailableCalls(page, 5);

      if (isRefresh || page === 1) {
        setCalls(response.data);
      } else {
        setCalls((prev) => [...prev, ...response.data]);
      }

      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalRecords(response.totalRecords);
    } catch (err: any) {
      setError(err.message || "Failed to fetch available calls");
      console.error("Error fetching calls:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCalls(1);
  }, []);

  const handleRefresh = () => {
    fetchCalls(1, true);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchCalls(currentPage + 1);
    }
  };

  const handleApplyPress = (callId: number) => {
    Alert.alert(
      "Apply for Call",
      "Are you sure you want to apply for this pickup request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Apply",
          style: "default",
          onPress: () => {
            // TODO: Implement apply logic
            Alert.alert(
              "Application Submitted",
              "Your application has been submitted successfully! The parent will be notified.",
              [{ text: "OK", onPress: () => router.back() }]
            );
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Available Calls</Text>
        <Text style={styles.headerSubtitle}>
          {totalRecords} requests available • Page {currentPage} of {totalPages}
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
          <Text style={styles.loadingText}>Loading available calls...</Text>
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
            onPress={() => fetchCalls(1)}
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
          <Text style={styles.emptyTitle}>No Calls Available</Text>
          <Text style={styles.emptyText}>
            There are currently no pickup requests available. Check back later!
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
          />
        ))}

        {currentPage < totalPages && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={handleLoadMore}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FF932E" />
            ) : (
              <>
                <FontAwesome5 name="plus" size={16} color="#FF932E" />
                <Text style={styles.loadMoreText}>Load More Calls</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
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
  loadMoreButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: "#fff",
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF932E",
  },
  loadMoreText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#FF932E",
    marginLeft: 8,
  },
};
