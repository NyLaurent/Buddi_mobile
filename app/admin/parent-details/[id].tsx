import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { authorizedApi } from "../../../services/api/config";
import ParentService, {
  ParentRecord,
} from "../../../services/api/parent.service";

export default function ParentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [parentDetails, setParentDetails] = useState<ParentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchParentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ParentService.getParentInfo(id as string);
      setParentDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch parent details");
      console.error("Error fetching parent details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchParentDetails();
    }
  }, [id]);

  const handleBackPress = () => {
    router.back();
  };

  const handleApprove = async () => {
    if (!parentDetails) return;

    Alert.alert(
      "Approve Parent",
      `Are you sure you want to approve ${
        parentDetails.User
          ? `${parentDetails.User.firstName} ${parentDetails.User.lastName}`
          : "this parent"
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          style: "default",
          onPress: async () => {
            setActionLoading(true);
            setActionError(null);
            setActionSuccess(null);

            try {
              await authorizedApi.patch(
                `/parent/${parentDetails.id}/approval`,
                {
                  status: "approved",
                }
              );
              setActionSuccess("Parent approved successfully!");

              // Refresh parent details
              setTimeout(() => {
                fetchParentDetails();
                setActionSuccess(null);
              }, 1500);
            } catch (err: any) {
              setActionError(
                err?.response?.data?.message ||
                  err?.message ||
                  "Failed to approve parent."
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!parentDetails) return;

    Alert.alert(
      "Reject Parent",
      `Are you sure you want to reject ${
        parentDetails.User
          ? `${parentDetails.User.firstName} ${parentDetails.User.lastName}`
          : "this parent"
      }? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setActionLoading(true);
            setActionError(null);
            setActionSuccess(null);

            try {
              await authorizedApi.patch(
                `/parent/${parentDetails.id}/approval`,
                {
                  status: "rejected",
                }
              );
              setActionSuccess("Parent rejected successfully!");

              // Refresh parent details
              setTimeout(() => {
                fetchParentDetails();
                setActionSuccess(null);
              }, 1500);
            } catch (err: any) {
              setActionError(
                err?.response?.data?.message ||
                  err?.message ||
                  "Failed to reject parent."
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#34C759";
      case "pending":
        return "#FF932E";
      case "rejected":
        return "#FF3B30";
      default:
        return "#FF932E";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getBgcStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#34C759";
      case "in_progress":
        return "#FF932E";
      case "not_started":
        return "#8E8E93";
      default:
        return "#8E8E93";
    }
  };

  const getBgcStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "not_started":
        return "Not Started";
      default:
        return "Not Started";
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Parent Details</Text>
        <Text style={styles.headerSubtitle}>
          {parentDetails?.User
            ? `${parentDetails.User.firstName} ${parentDetails.User.lastName}`
            : "Loading..."}
        </Text>
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF932E" />
          <Text style={styles.loadingText}>Loading parent details...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF932E" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchParentDetails}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!parentDetails) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="person" size={48} color="#FF932E" />
          <Text style={styles.errorTitle}>Parent Not Found</Text>
          <Text style={styles.errorText}>
            The parent you're looking for doesn't exist.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Parent Basic Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Basic Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name:</Text>
            <Text style={styles.infoValue}>
              {parentDetails.User
                ? `${parentDetails.User.firstName} ${parentDetails.User.lastName}`
                : "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>
              {parentDetails.User?.email || "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>
              {parentDetails.User?.phoneNumber || "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>
              {parentDetails.User?.homeAddress || "N/A"}
            </Text>
          </View>
        </View>

        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Status Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Approval Status:</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    getStatusColor(parentDetails.approvalStage) + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(parentDetails.approvalStage) },
                ]}
              >
                {getStatusText(parentDetails.approvalStage)}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Background Check:</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    getBgcStatusColor(parentDetails.bgcStatus) + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getBgcStatusColor(parentDetails.bgcStatus) },
                ]}
              >
                {getBgcStatusText(parentDetails.bgcStatus)}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Method:</Text>
            <Text style={styles.infoValue}>
              {parentDetails.paymentMethod.charAt(0).toUpperCase() +
                parentDetails.paymentMethod.slice(1).replace("_", " ")}
            </Text>
          </View>
        </View>

        {/* Action Buttons Card - Only show if pending */}
        {parentDetails.approvalStage === "pending" && (
          <View style={styles.actionCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="shield-checkmark" size={20} color="#FF932E" />
              <Text style={styles.cardTitle}>Admin Actions</Text>
            </View>

            {/* Success/Error Messages */}
            {actionSuccess && (
              <View style={styles.successMessage}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                <Text style={styles.successText}>{actionSuccess}</Text>
              </View>
            )}

            {actionError && (
              <View style={styles.errorMessage}>
                <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                <Text style={styles.errorText}>{actionError}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={handleApprove}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Approve Parent</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="close" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Reject Parent</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.actionNote}>
              ⚠️ These actions will immediately affect the parent's account
              status
            </Text>
          </View>
        )}

        {/* Children Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Children Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Children:</Text>
            <Text style={styles.infoValue}>{parentDetails.childrenCount}</Text>
          </View>
          {parentDetails.children.map((child, index) => (
            <View key={index} style={styles.childCard}>
              <Text style={styles.childName}>{child.name}</Text>
              <View style={styles.childInfo}>
                <Text style={styles.childDetail}>Age: {child.age}</Text>
                <Text style={styles.childDetail}>School: {child.school}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Account Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="settings" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Account Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Parent ID:</Text>
            <Text style={styles.infoValue}>{parentDetails.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>
              {parentDetails.userId || "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>
              {formatDate(parentDetails.createdAt)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>
              {formatDate(parentDetails.updatedAt)}
            </Text>
          </View>
        </View>
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
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
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
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  infoLabel: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right" as const,
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
  childCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  childName: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  childInfo: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  childDetail: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#666",
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
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  actionButtonsContainer: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  approveButton: {
    backgroundColor: "#34C759",
  },
  rejectButton: {
    backgroundColor: "#FF3B30",
  },
  actionButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
  },
  successMessage: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#a5d6a7",
  },
  successText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#2e7d32",
    marginLeft: 8,
  },
  errorMessage: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#ffebee",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ef5350",
  },
  errorText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#c62828",
    marginLeft: 8,
  },
  actionNote: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 16,
    textAlign: "center" as const,
  },
};
