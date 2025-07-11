import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import BuddiService, {
  BuddiDetails,
} from "../../../services/api/buddi.service";

export default function BuddiDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [buddiDetails, setBuddiDetails] = useState<BuddiDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [reason, setReason] = useState("");

  const fetchBuddiDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BuddiService.getBuddiInfo(id as string);
      setBuddiDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch buddi details");
      console.error("Error fetching buddi details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBuddiDetails();
    }
  }, [id]);

  const handleBackPress = () => {
    router.back();
  };

  const handleApprove = () => {
    setActionType("approve");
    setShowReasonModal(true);
  };

  const handleReject = () => {
    setActionType("reject");
    setShowReasonModal(true);
  };

  const handleAction = async () => {
    if (!buddiDetails || !actionType) return;

    setActionLoading(true);
    try {
      if (actionType === "approve") {
        await BuddiService.approveBuddi(
          buddiDetails.id.toString(),
          buddiDetails.status,
          reason
        );
        Alert.alert("Success", "Buddi status updated successfully!");
      } else {
        await BuddiService.rejectBuddi(buddiDetails.id.toString(), reason);
        Alert.alert("Success", "Buddi rejected successfully!");
      }

      // Refresh the data to show updated status
      await fetchBuddiDetails();
      setShowReasonModal(false);
      setReason("");
      setActionType(null);
    } catch (err: any) {
      Alert.alert("Error", err.message || `Failed to ${actionType} buddi`);
    } finally {
      setActionLoading(false);
    }
  };

  const closeReasonModal = () => {
    setShowReasonModal(false);
    setReason("");
    setActionType(null);
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "RegisterApprovalPending":
        return "Registered";
      case "Registered":
        return "submissionApproved";
      case "submissionApproved":
        return "referenceApproved";
      case "referenceApproved":
        return "verified";
      case "verified":
        return "approved";
      default:
        return "approved";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDOB = (dateString: string) => {
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

  const getGenderText = (gender: string) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Buddi Details</Text>
        <Text style={styles.headerSubtitle}>
          {buddiDetails?.User
            ? `${buddiDetails.User.firstName} ${buddiDetails.User.lastName}`
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
          <Text style={styles.loadingText}>Loading buddi details...</Text>
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
            onPress={fetchBuddiDetails}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!buddiDetails) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="person" size={48} color="#FF932E" />
          <Text style={styles.errorTitle}>Buddi Not Found</Text>
          <Text style={styles.errorText}>
            The buddi you&apos;re looking for doesn&apos;t exist.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Basic Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Basic Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name:</Text>
            <Text style={styles.infoValue}>
              {buddiDetails.User
                ? `${buddiDetails.User.firstName} ${buddiDetails.User.lastName}`
                : "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>
              {buddiDetails.User?.email || "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>
              {buddiDetails.User?.phoneNumber || "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>
              {buddiDetails.User?.homeAddress || "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>{formatDOB(buddiDetails.dob)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>
              {getGenderText(buddiDetails.gender)}
            </Text>
          </View>
        </View>

        {/* Academic Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="school" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Academic Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current School:</Text>
            <Text style={styles.infoValue}>{buddiDetails.currentSchool}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Area of Study:</Text>
            <Text style={styles.infoValue}>{buddiDetails.AreaOfStudy}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>GPA:</Text>
            <Text style={styles.infoValue}>{buddiDetails.Gpa}</Text>
          </View>
        </View>

        {/* Status Information Card */}
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
                { backgroundColor: getStatusColor(buddiDetails.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(buddiDetails.status) },
                ]}
              >
                {getStatusText(buddiDetails.status)}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Interview Video:</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: buddiDetails.isInterviewVideoSubmitted
                    ? "#E8F5E9"
                    : "#FFEBEE",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: buddiDetails.isInterviewVideoSubmitted
                      ? "#34C759"
                      : "#FF3B30",
                  },
                ]}
              >
                {buddiDetails.isInterviewVideoSubmitted
                  ? "Submitted"
                  : "Not Submitted"}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rating:</Text>
            <Text style={styles.infoValue}>
              {buddiDetails.rating
                ? `${buddiDetails.rating}/5`
                : "No rating yet"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Earnings:</Text>
            <Text style={styles.infoValue}>${buddiDetails.totalEarnings}</Text>
          </View>
        </View>

        {/* Action Buttons Card - Only show for pending buddis */}
        {!(
          buddiDetails.status === "approved" ||
          buddiDetails.status === "referenceApproved" ||
          buddiDetails.status === "verified" ||
          buddiDetails.status === "rejected"
        ) && (
          <View style={styles.actionCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="shield-checkmark" size={20} color="#FF932E" />
              <Text style={styles.cardTitle}>Admin Actions</Text>
            </View>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={handleApprove}
                disabled={actionLoading}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={handleReject}
                disabled={actionLoading}
              >
                <Ionicons name="close-circle" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
            {actionLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FF932E" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            )}
          </View>
        )}

        {/* Referral Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Referral Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teacher Email:</Text>
            <Text style={styles.infoValue}>{buddiDetails.teacherEmail}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teacher Phone:</Text>
            <Text style={styles.infoValue}>
              {buddiDetails.teacherPhoneNumber}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Custom Referral:</Text>
            <Text style={styles.infoValue}>{buddiDetails.customReferral}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Referral Occupation:</Text>
            <Text style={styles.infoValue}>
              {buddiDetails.referralOccupation}
            </Text>
          </View>
        </View>

        {/* Documents Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Documents</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Resume:</Text>
            <TouchableOpacity style={styles.documentLink}>
              <Ionicons name="document-text" size={16} color="#FF932E" />
              <Text style={styles.documentLinkText}>View Resume</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Profile Picture:</Text>
            <Text style={styles.infoValue}>
              {buddiDetails.profilePicture ? "Available" : "Not uploaded"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Videos:</Text>
            <Text style={styles.infoValue}>
              {buddiDetails.Videos.length} video
              {buddiDetails.Videos.length !== 1 ? "s" : ""} uploaded
            </Text>
          </View>
        </View>

        {/* Account Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="settings" size={20} color="#FF932E" />
            <Text style={styles.cardTitle}>Account Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Buddi ID:</Text>
            <Text style={styles.infoValue}>{buddiDetails.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{buddiDetails.userId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>
              {formatDate(buddiDetails.createdAt)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>
              {formatDate(buddiDetails.updatedAt)}
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

      {/* Reason Modal */}
      {showReasonModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {actionType === "approve" ? "Approve" : "Reject"} Buddi
              </Text>
              <TouchableOpacity onPress={closeReasonModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              {actionType === "approve"
                ? "Please provide a reason for approving this buddi (optional):"
                : "Please provide a reason for rejecting this buddi:"}
            </Text>
            <TextInput
              style={styles.reasonInput}
              placeholder={
                actionType === "approve"
                  ? "Enter approval reason (optional)..."
                  : "Enter rejection reason..."
              }
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeReasonModal}
                disabled={actionLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  actionType === "approve"
                    ? styles.confirmApproveButton
                    : styles.confirmRejectButton,
                ]}
                onPress={handleAction}
                disabled={
                  actionLoading || (actionType === "reject" && !reason.trim())
                }
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {actionType === "approve" ? "Approve" : "Reject"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  documentLink: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  documentLinkText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#FF932E",
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
    justifyContent: "space-between" as const,
    marginTop: 16,
    gap: 16,
  },
  actionButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  approveButton: {
    backgroundColor: "#34C759",
    flex: 1,
  },
  rejectButton: {
    backgroundColor: "#FF3B30",
    flex: 1,
  },
  actionButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#fff",
  },
  loadingContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginTop: 16,
  },
  modalOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: Dimensions.get("window").width * 0.9,
    alignItems: "center" as const,
  },
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    width: Dimensions.get("window").width * 1.0,
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 20,
    color: "#333",
  },
  modalSubtitle: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center" as const,
  },
  reasonInput: {
    width: Dimensions.get("window").width * 0.9,
    height: 120,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 12,
    padding: 12,
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#333",
    textAlignVertical: "top" as const,
  },
  modalButtons: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    width: Dimensions.get("window").width * 1.0,
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: "center" as const,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#e9ecef",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  cancelButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#333",
  },
  confirmApproveButton: {
    backgroundColor: "#34C759",
  },
  confirmRejectButton: {
    backgroundColor: "#FF3B30",
  },
  confirmButtonText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: "#fff",
  },
};
