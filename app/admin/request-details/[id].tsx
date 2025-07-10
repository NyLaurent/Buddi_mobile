import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import ParentService, {
  ParentPickupRequest,
  ParentRecord,
} from "../../../services/api/parent.service";

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [requestDetails, setRequestDetails] =
    useState<ParentPickupRequest | null>(null);
  const [parentData, setParentData] = useState<ParentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ParentService.getParentRequestDetails(Number(id));
      setRequestDetails(response.data);

      // Fetch parent data to get the parent name
      await fetchParentData(response.data.parentId);
    } catch (err: any) {
      setError(err.message || "Failed to fetch request details");
      console.error("Error fetching request details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParentData = async (parentId: string) => {
    try {
      const response = await ParentService.getAllParents(1, 100);
      const parent = response.data.find(
        (p) => p.userId === parentId || p.id === parentId
      );
      if (parent) {
        setParentData(parent);
      }
    } catch (err: any) {
      console.error("Error fetching parent data:", err);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (time: string) => {
    if (time.includes(":")) {
      return time;
    }
    return time;
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

  const getParentName = () => {
    if (parentData?.User) {
      return `${parentData.User.firstName} ${parentData.User.lastName}`;
    }
    return `Parent ${requestDetails?.parentId.slice(0, 8)}`;
  };

  const getParentEmail = () => {
    return (
      parentData?.User?.email ||
      `parent${requestDetails?.parentId.slice(0, 8)}@example.com`
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Request Details</Text>
        <Text style={styles.headerSubtitle}>Request #{id}</Text>
      </View>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#FF932E" />
      <Text style={styles.loadingText}>Loading request details...</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Ionicons name="alert-circle" size={48} color="#FF932E" />
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={fetchRequestDetails}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (!requestDetails) return null;

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <LinearGradient
            colors={["#FF932E", "#FFB86C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusGradient}
          >
            <View style={styles.statusContent}>
              <Ionicons name="document-text" size={32} color="#fff" />
              <Text style={styles.statusTitle}>Parent Request</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: "#fff",
                    borderWidth: 2,
                    borderColor: getStatusColor(requestDetails.status),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(requestDetails.status) },
                  ]}
                >
                  {getStatusText(requestDetails.status)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Parent Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Parent Information</Text>
          </View>
          <View style={styles.parentInfoContainer}>
            <View style={styles.parentDetail}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>{getParentName()}</Text>
            </View>
            <View style={styles.parentDetail}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{getParentEmail()}</Text>
            </View>
            <View style={styles.parentDetail}>
              <Text style={styles.detailLabel}>Parent ID:</Text>
              <Text style={styles.detailValue}>{requestDetails.parentId}</Text>
            </View>
          </View>
        </View>

        {/* Request Description Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="clipboard" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Request Description</Text>
          </View>
          <Text style={styles.descriptionText}>
            {requestDetails.description}
          </Text>
        </View>

        {/* Service Details Grid */}
        <View style={styles.detailsGrid}>
          {/* Time */}
          <View style={styles.detailCard}>
            <Ionicons name="time" size={24} color="#FF932E" />
            <Text style={styles.detailValue}>
              {formatTime(requestDetails.pickupTime)}
            </Text>
            <Text style={styles.detailLabel}>Pickup Time</Text>
          </View>

          {/* Kids Count */}
          <View style={styles.detailCard}>
            <Ionicons name="people" size={24} color="#FF932E" />
            <Text style={styles.detailValue}>{requestDetails.kidsCount}</Text>
            <Text style={styles.detailLabel}>Kids Count</Text>
          </View>

          {/* Days */}
          <View style={styles.detailCard}>
            <Ionicons name="calendar" size={24} color="#FF932E" />
            <Text style={styles.detailValue}>
              {requestDetails.availableDays.length}
            </Text>
            <Text style={styles.detailLabel}>Available Days</Text>
          </View>
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Location Details</Text>
          </View>
          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <Ionicons name="arrow-up" size={16} color="#FF932E" />
              <Text style={styles.locationLabel}>From:</Text>
              <Text style={styles.locationText}>{requestDetails.fromZone}</Text>
            </View>
            <View style={styles.locationItem}>
              <Ionicons name="arrow-down" size={16} color="#34C759" />
              <Text style={styles.locationLabel}>To:</Text>
              <Text style={styles.locationText}>{requestDetails.toZone}</Text>
            </View>
          </View>
        </View>

        {/* Available Days Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Available Days</Text>
          </View>
          <View style={styles.daysContainer}>
            {requestDetails.availableDays.map((day, index) => (
              <View key={index} style={styles.dayTag}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Request Metadata Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="settings" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Request Information</Text>
          </View>
          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Request ID:</Text>
              <Text style={styles.metadataValue}>{requestDetails.id}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Child ID:</Text>
              <Text style={styles.metadataValue}>{requestDetails.childId}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Created:</Text>
              <Text style={styles.metadataValue}>
                {formatDate(requestDetails.createdAt)}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Last Updated:</Text>
              <Text style={styles.metadataValue}>
                {formatDate(requestDetails.updatedAt)}
              </Text>
            </View>
            {requestDetails.matchedBuddiId && (
              <View style={styles.metadataItem}>
                <Text style={styles.metadataLabel}>Matched Buddi ID:</Text>
                <Text style={styles.metadataValue}>
                  {requestDetails.matchedBuddiId}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      {loading ? renderLoading() : error ? renderError() : renderContent()}
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
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
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
  statusCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden" as const,
    shadowColor: "#FF932E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  statusGradient: {
    padding: 24,
  },
  statusContent: {
    alignItems: "center" as const,
  },
  statusTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 24,
    color: "#fff",
    marginTop: 12,
    marginBottom: 16,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    color: "#333",
    marginLeft: 12,
  },
  parentInfoContainer: {
    gap: 12,
  },
  parentDetail: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  detailLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  descriptionText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 16,
  },
  detailCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center" as const,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationContainer: {
    gap: 12,
  },
  locationItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  locationLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginRight: 8,
    minWidth: 40,
  },
  locationText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  daysContainer: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  dayTag: {
    backgroundColor: "#FF932E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dayText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 12,
    color: "#fff",
  },
  metadataContainer: {
    gap: 12,
  },
  metadataItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  metadataLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#666",
    marginRight: 8,
    minWidth: 120,
  },
  metadataValue: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
};
