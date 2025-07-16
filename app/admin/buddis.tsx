import { AdminBuddiApplicationCard } from "@/components/admin/AdminBuddiApplicationCard";
import AdminVideosInterviewsContainer from "@/components/admin/AdminVideosInterviewsContainer";
import BuddisTable from "@/components/admin/BuddisTable";
import CoverageAlertCard from "@/components/admin/CoverageAlertCard";
import FeedbackReportsContainer from "@/components/admin/FeedbackReportsCard";
import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import BuddiService, {
  Buddi as BuddiApiType,
} from "@/services/api/buddi.service";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = [
  { id: "all", label: "All Buddis" },
  { id: "approvals", label: "Reference Approvals" },
  { id: "feedback", label: "Feedback" },
  { id: "videos", label: "Profile Videos & Interviews" },
];

const buddiStatuses = [
  { id: "RegisterApprovalPending", label: "Register Approval Pending" },
  { id: "Registered", label: "Registered" },
  { id: "submissionApproved", label: "Submission Approved" },
  { id: "referenceApproved", label: "Reference Approved" },
  { id: "verified", label: "Verified" },
  { id: "approved", label: "Approved" },
];

export default function AdminBuddisPage() {
  const [activeTab, setActiveTab] = useState("all");
  // Buddi status tab state
  const [activeStatus, setActiveStatus] = useState(buddiStatuses[0].id);
  const [buddies, setBuddies] = useState<BuddiApiType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBuddi, setSelectedBuddi] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [reason, setReason] = useState("");

  // New state for paginated cards
  const [pendingPage, setPendingPage] = useState(1);
  const pendingLimit = 3;
  const [pendingTotal, setPendingTotal] = useState(0);
  const [pendingBuddies, setPendingBuddies] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);

  // State for card action modal
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [selectedCardBuddi, setSelectedCardBuddi] = useState<any>(null);
  const [cardActionType, setCardActionType] = useState<
    "approve" | "reject" | null
  >(null);
  const [cardReason, setCardReason] = useState("");
  const [cardActionLoading, setCardActionLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "all") {
      fetchBuddies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus, page, activeTab]);

  const fetchBuddies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BuddiService.getBuddiesByStatus(
        activeStatus,
        page,
        limit
      );
      setBuddies(res.data);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch Buddis");
      setBuddies([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissionApproved Buddis for cards
  const fetchPendingBuddies = async () => {
    setPendingLoading(true);
    setPendingError(null);
    try {
      const res = await BuddiService.getBuddiesByStatus(
        "submissionApproved",
        pendingPage,
        pendingLimit
      );
      setPendingBuddies(res.data);
      setPendingTotal(res.total);
    } catch (err: any) {
      setPendingError(err.message || "Failed to fetch pending Buddis");
      setPendingBuddies([]);
      setPendingTotal(0);
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBuddies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPage]);

  const handleApprove = async (id: string, currentStatus: string) => {
    setActionLoading(id + "-approve");
    try {
      await BuddiService.approveBuddi(id, currentStatus);
      Alert.alert("Success", "Buddi approved successfully.");
      fetchBuddies();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to approve Buddi");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + "-reject");
    try {
      await BuddiService.rejectBuddi(id);
      Alert.alert("Success", "Buddi rejected successfully.");
      fetchBuddies();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to reject Buddi");
    } finally {
      setActionLoading(null);
    }
  };

  const openActionModal = (buddi: any) => {
    setSelectedBuddi(buddi);
    setModalVisible(true);
    setActionType(null);
    setReason("");
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedBuddi(null);
    setActionType(null);
    setReason("");
  };

  const openCardActionModal = (buddi: any) => {
    setSelectedCardBuddi(buddi);
    setCardModalVisible(true);
    setCardActionType(null);
    setCardReason("");
  };

  const closeCardModal = () => {
    setCardModalVisible(false);
    setSelectedCardBuddi(null);
    setCardActionType(null);
    setCardReason("");
  };

  const handleCardAction = async () => {
    if (!selectedCardBuddi || !cardActionType) return;
    setCardActionLoading(true);
    try {
      let newStatus = selectedCardBuddi.status;
      if (cardActionType === "approve") {
        newStatus = getNextStatus(selectedCardBuddi.status);
      } else if (cardActionType === "reject") {
        newStatus = "rejected";
      }
      await BuddiService.updateStatus(
        selectedCardBuddi.id,
        newStatus,
        cardReason
      );
      Alert.alert("Success", `Buddi ${cardActionType}d successfully.`);
      closeCardModal();
      fetchPendingBuddies(); // Refresh the cards
    } catch (err: any) {
      Alert.alert("Error", err.message || `Failed to ${cardActionType} Buddi`);
    } finally {
      setCardActionLoading(false);
    }
  };

  // Status progression order
  const statusOrder = [
    "RegisterApprovalPending",
    "Registered",
    "submissionApproved",
    "referenceApproved",
    "approved",
    "verified",
  ];

  const getNextStatus = (current: string) => {
    const idx = statusOrder.indexOf(current);
    if (idx === -1 || idx === statusOrder.length - 1) return current;
    return statusOrder[idx + 1];
  };

  const handleAction = async () => {
    if (!selectedBuddi || !actionType) return;
    setActionLoading(selectedBuddi.id + "-" + actionType);
    try {
      let newStatus = selectedBuddi.status;
      if (actionType === "approve") {
        newStatus = getNextStatus(selectedBuddi.status);
      } else if (actionType === "reject") {
        newStatus = "rejected";
      }
      await BuddiService.updateStatus(selectedBuddi.id, newStatus, reason);
      Alert.alert("Success", `Buddi ${actionType}d successfully.`);
      closeModal();
      fetchBuddies();
    } catch (err: any) {
      Alert.alert("Error", err.message || `Failed to ${actionType} Buddi`);
    } finally {
      setActionLoading(null);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return (
          <View>
            {/* Analytics Cards */}
            <View style={styles.analyticsGrid}>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={<Ionicons name="flash" size={36} color="#00BCD4" />}
                  title="Total Buddis"
                  value="12"
                  subtitle="2 Schools"
                />
              </View>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={
                    <MaterialIcons name="pending" size={36} color="#9C27B0" />
                  }
                  title="Pending Approvals"
                  value="3"
                  subtitle="All time"
                />
              </View>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={
                    <MaterialIcons
                      name="support-agent"
                      size={36}
                      color="#E91E63"
                    />
                  }
                  title="Coverage Requests"
                  value="3"
                  subtitle="Connected"
                />
              </View>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={
                    <MaterialIcons
                      name="report-problem"
                      size={36}
                      color="#9C27B0"
                    />
                  }
                  title="Reported Issues"
                  value="2"
                  subtitle="2 Schools"
                />
              </View>
            </View>

            {/* Coverage Alert Section */}
            {/* <View>
              <CoverageAlertCard
                title="21 Buddis Need Coverage For Today"
                subtitle="Review this before effects!"
                description="Please review Buddis requesting coverage to ensure availability and reliability."
                primaryButton={{
                  label: "Handle Coverages",
                  icon: <Ionicons name="hammer" size={18} color="#fff" />,
                  onPress: () => {
                    // Handle coverage logic
                    console.log("Handle coverages pressed");
                  },
                }}
              />
            </View> */}
            {/* Buddi Status Tabs */}
            <View style={styles.statusTabsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statusTabsScroll}
              >
                {buddiStatuses.map((status) => (
                  <TouchableOpacity
                    key={status.id}
                    style={[
                      styles.statusTab,
                      activeStatus === status.id && styles.activeStatusTab,
                    ]}
                    onPress={() => {
                      setActiveStatus(status.id);
                      setPage(1);
                    }}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        activeStatus === status.id && styles.activeStatusDot,
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusTabText,
                        activeStatus === status.id &&
                          styles.activeStatusTabText,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {/* Buddis Table Section */}
            {loading ? (
              <View style={{ alignItems: "center", marginVertical: 32 }}>
                <Text
                  style={{ color: "#666", fontFamily: "Comfortaa-Regular" }}
                >
                  Loading Buddis...
                </Text>
              </View>
            ) : error ? (
              <View style={{ alignItems: "center", marginVertical: 32 }}>
                <Text
                  style={{ color: "#E53935", fontFamily: "Comfortaa-Regular" }}
                >
                  {error}
                </Text>
                <TouchableOpacity
                  onPress={fetchBuddies}
                  style={{
                    marginTop: 8,
                    padding: 8,
                    backgroundColor: "#4F46E5",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontFamily: "Comfortaa-Regular" }}
                  >
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <BuddisTable
                data={buddies.map((b) => ({
                  id: b.id,
                  name: b.User
                    ? `${b.User.firstName ?? ""} ${
                        b.User.lastName ?? ""
                      }`.trim()
                    : "N/A",
                  email: b.User?.email ?? "N/A",
                  areaOfStudy: b.AreaOfStudy ?? "-",
                  currentSchool: b.currentSchool ?? "-",
                  status: b.status ?? "-",
                }))}
                currentPage={page}
                totalPages={Math.ceil(total / limit)}
                onPageChange={setPage}
                onActionClick={(buddi) => {
                  router.push({
                    pathname: "/admin/buddi-details/[id]",
                    params: { id: buddi.id },
                  });
                }}
              />
            )}
          </View>
        );
      case "approvals":
        return (
          <View>
            {/* Analytics Cards Row */}
            <View style={styles.analyticsRow}>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={<Ionicons name="flash" size={36} color="#00BCD4" />}
                  title="Total Buddis"
                  value="12"
                  subtitle="2 Schools"
                />
              </View>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={
                    <MaterialIcons name="pending" size={36} color="#9C27B0" />
                  }
                  title="Pending Approvals"
                  value="3"
                  subtitle="All time"
                />
              </View>
            </View>

            {/* Coverage Alert Section */}
            {/* <View>
              <CoverageAlertCard
                title="Customize Buddi Screening Questions"
                subtitle="Create and manage the questions Buddis must answer during onboarding. Tailor your vetting process to fit your program's standards and ensure quality matches."
                description=""
                primaryButton={{
                  label: "Manage Questions Bank",
                  icon: (
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  ),
                  onPress: () => {
                    // Handle manage questions logic
                    console.log("Manage questions pressed");
                  },
                }}
              />
            </View> */}

            {/* Pending Buddi Applications as Cards */}
            <View style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 18,

                  color: "#23272F",
                  fontFamily: "Comfortaa-Bold",
                  marginBottom: 12,
                }}
              >
                Pending Buddi Applications
              </Text>
              {pendingLoading ? (
                <View style={{ alignItems: "center", marginVertical: 32 }}>
                  <Text
                    style={{ color: "#666", fontFamily: "Comfortaa-Regular" }}
                  >
                    Loading...
                  </Text>
                </View>
              ) : pendingError ? (
                <View style={{ alignItems: "center", marginVertical: 32 }}>
                  <Text
                    style={{
                      color: "#E53935",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    {pendingError}
                  </Text>
                </View>
              ) : (
                <>
                  {pendingBuddies
                    .filter((b) => b.User)
                    .slice(0, 3)
                    .map((b) => (
                      <AdminBuddiApplicationCard
                        key={b.id}
                        application={{
                          id: b.id,
                          name: `${b.User.firstName ?? ""} ${
                            b.User.lastName ?? ""
                          }`.trim(),
                          gender: b.gender ?? "-",
                          email: b.User.email ?? "-",
                          age: b.dob
                            ? `${
                                new Date().getFullYear() -
                                new Date(b.dob).getFullYear()
                              }`
                            : "-",
                          school: b.currentSchool ?? "-",
                          schoolName: b.currentSchool ?? "-",
                          phone: b.User.phoneNumber ?? "-",
                          reference: {
                            name: b.customReferral ?? "-",
                            email: b.teacherEmail ?? "-",
                            phone: b.teacherPhoneNumber ?? "-",
                            role: b.referralOccupation ?? "-",
                          },
                          status: b.status || "Not yet reviewed",
                          avatar:
                            b.profilePicture ||
                            "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(
                                `${b.User.firstName ?? ""} ${
                                  b.User.lastName ?? ""
                                }`.trim()
                              ),
                        }}
                        onViewDetails={() =>
                          router.push({
                            pathname: "/admin/buddi-details",
                            params: { id: b.id },
                          })
                        }
                        onApprove={() => openCardActionModal(b)}
                      />
                    ))}
                  {pendingBuddies.filter((b) => b.User).length > 3 && (
                    <TouchableOpacity
                      style={{
                        marginTop: 12,
                        alignSelf: "center",
                        backgroundColor: "#FF932E",
                        borderRadius: 8,
                        paddingVertical: 10,
                        paddingHorizontal: 28,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                      onPress={() => router.push("/admin/buddis")}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 16,
                        }}
                      >
                        View All
                      </Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </TouchableOpacity>
                  )}
                  {/* Pagination for cards */}
                  {pendingTotal > pendingLimit && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 16,
                        gap: 8,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          padding: 8,
                          opacity: pendingPage === 1 ? 0.5 : 1,
                        }}
                        onPress={() =>
                          setPendingPage(Math.max(1, pendingPage - 1))
                        }
                        disabled={pendingPage === 1}
                      >
                        <Ionicons
                          name="chevron-back"
                          size={20}
                          color={pendingPage === 1 ? "#ccc" : "#FF9500"}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Regular",
                          color: "#23272F",
                        }}
                      >
                        Page {pendingPage} of{" "}
                        {Math.ceil(pendingTotal / pendingLimit)}
                      </Text>
                      <TouchableOpacity
                        style={{
                          padding: 8,
                          opacity:
                            pendingPage ===
                            Math.ceil(pendingTotal / pendingLimit)
                              ? 0.5
                              : 1,
                        }}
                        onPress={() =>
                          setPendingPage(
                            Math.min(
                              Math.ceil(pendingTotal / pendingLimit),
                              pendingPage + 1
                            )
                          )
                        }
                        disabled={
                          pendingPage === Math.ceil(pendingTotal / pendingLimit)
                        }
                      >
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={
                            pendingPage ===
                            Math.ceil(pendingTotal / pendingLimit)
                              ? "#ccc"
                              : "#FF9500"
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        );
      case "feedback":
        return (
          <View>
            {/* Analytics Cards Row */}
            <View style={styles.analyticsRow}>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={<Ionicons name="thumbs-up" size={36} color="#4CAF50" />}
                  title="Pending Approvals"
                  value="12"
                  subtitle="Pending"
                />
              </View>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={<Ionicons name="eye" size={36} color="#2196F3" />}
                  title="Reviewed"
                  value="12"
                  subtitle="Pending"
                />
              </View>
            </View>

            {/* Coverage Alert Section */}
            <View>
              {/* <CoverageAlertCard
                title="21 Buddis Need Coverage For Today"
                subtitle="Review this before effects!"
                description="Please review Buddis requesting coverage to ensure availability and reliability."
                primaryButton={{
                  label: "Handle Coverages",
                  icon: <Ionicons name="hammer" size={18} color="#fff" />,
                  onPress: () => {
                    router.push("/admin/backup-requests");
                  },
                }}
              /> */}
            </View>

            {/* Feedback Reports Container */}
            <FeedbackReportsContainer />
          </View>
        );
      case "videos":
        return (
          <View>
            <AdminVideosInterviewsContainer />
          </View>
        );
      default:
        return null;
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
        {/* Header */}
        <View className="pt-6">
          <PageHeader title="Buddi Management" />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <View style={styles.tabGrid}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        <View style={styles.content}>{renderTabContent()}</View>
      </ScrollView>
      {/* Action Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              width: 340,
              maxWidth: "90%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#23272F",
                fontFamily: "Comfortaa-Bold",
                marginBottom: 8,
              }}
            >
              Buddi Action
            </Text>
            <Text
              style={{
                color: "#666",
                fontFamily: "Comfortaa-Regular",
                marginBottom: 16,
              }}
            >
              What would you like to do with{" "}
              <Text style={{ color: "#4F46E5", fontWeight: "bold" }}>
                {selectedBuddi?.name}
              </Text>
              ?
            </Text>
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor:
                    actionType === "approve" ? "#22C55E" : "#F3F4F6",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={() => setActionType("approve")}
              >
                <Text
                  style={{
                    color: actionType === "approve" ? "#fff" : "#23272F",
                    fontWeight: "bold",
                    fontFamily: "Comfortaa-Regular",
                  }}
                >
                  Approve
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor:
                    actionType === "reject" ? "#EF4444" : "#F3F4F6",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={() => setActionType("reject")}
              >
                <Text
                  style={{
                    color: actionType === "reject" ? "#fff" : "#23272F",
                    fontWeight: "bold",
                    fontFamily: "Comfortaa-Regular",
                  }}
                >
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 8,
                padding: 10,
                fontFamily: "Comfortaa-Regular",
                marginBottom: 16,
                minHeight: 44,
              }}
              placeholder="Reason (optional)"
              value={reason}
              onChangeText={setReason}
              multiline
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={closeModal}
                disabled={!!actionLoading}
              >
                <Text
                  style={{
                    color: "#23272F",
                    fontWeight: "bold",
                    fontFamily: "Comfortaa-Regular",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: actionType
                    ? actionType === "approve"
                      ? "#22C55E"
                      : "#EF4444"
                    : "#E5E7EB",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                  opacity: !actionType ? 0.7 : 1,
                }}
                onPress={handleAction}
                disabled={!actionType || !!actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    {actionType === "approve"
                      ? "Approve"
                      : actionType === "reject"
                      ? "Reject"
                      : "Select Action"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Card Action Modal */}
      <Modal
        visible={cardModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCardModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              width: 340,
              maxWidth: "90%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#23272F",
                fontFamily: "Comfortaa-Bold",
                marginBottom: 8,
              }}
            >
              Buddi Action
            </Text>
            <Text
              style={{
                color: "#666",
                fontFamily: "Comfortaa-Regular",
                marginBottom: 16,
              }}
            >
              What would you like to do with{" "}
              <Text style={{ color: "#FF9500", fontWeight: "bold" }}>
                {selectedCardBuddi?.User
                  ? `${selectedCardBuddi.User.firstName ?? ""} ${
                      selectedCardBuddi.User.lastName ?? ""
                    }`.trim()
                  : "N/A"}
              </Text>
              ?
            </Text>
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor:
                    cardActionType === "approve" ? "#22C55E" : "#F3F4F6",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={() => setCardActionType("approve")}
              >
                <Text
                  style={{
                    color: cardActionType === "approve" ? "#fff" : "#23272F",
                    fontWeight: "bold",
                    fontFamily: "Comfortaa-Regular",
                  }}
                >
                  Approve
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor:
                    cardActionType === "reject" ? "#EF4444" : "#F3F4F6",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={() => setCardActionType("reject")}
              >
                <Text
                  style={{
                    color: cardActionType === "reject" ? "#fff" : "#23272F",
                    fontWeight: "bold",
                    fontFamily: "Comfortaa-Regular",
                  }}
                >
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 8,
                padding: 10,
                fontFamily: "Comfortaa-Regular",
                marginBottom: 16,
                minHeight: 44,
              }}
              placeholder="Reason (optional)"
              value={cardReason}
              onChangeText={setCardReason}
              multiline
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={closeCardModal}
                disabled={!!cardActionLoading}
              >
                <Text
                  style={{
                    color: "#23272F",
                    fontWeight: "bold",
                    fontFamily: "Comfortaa-Regular",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: cardActionType
                    ? cardActionType === "approve"
                      ? "#22C55E"
                      : "#EF4444"
                    : "#E5E7EB",
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: "center",
                  opacity: !cardActionType ? 0.7 : 1,
                }}
                onPress={handleCardAction}
                disabled={!cardActionType || !!cardActionLoading}
              >
                {cardActionLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontFamily: "Comfortaa-Regular",
                    }}
                  >
                    {cardActionType === "approve"
                      ? "Approve"
                      : cardActionType === "reject"
                      ? "Reject"
                      : "Select Action"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  tabGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  tab: {
    width: "48%",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  activeTab: {
    backgroundColor: "#fff",
    borderColor: "#E8E8E8",
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
    textAlign: "center",
  },
  activeTabText: {
    color: "#23272F",
    fontFamily: "Comfortaa-Bold",
  },
  content: {
    paddingHorizontal: 16,
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  cardContainer: {
    width: "48%",
    marginBottom: 12,
  },
  tabContent: {
    padding: 20,
    alignItems: "center",
  },
  contentText: {
    fontSize: 16,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusTabsContainer: {
    marginVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusTabsScroll: {
    paddingHorizontal: 16,
  },
  statusTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    gap: 8,
  },
  activeStatusTab: {
    backgroundColor: "#FF932E",
    borderColor: "#FF932E",
    shadowColor: "#FF932E",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  activeStatusDot: {
    backgroundColor: "#fff",
  },
  statusTabText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
    fontWeight: "500",
  },
  activeStatusTabText: {
    color: "#fff",
    fontFamily: "Comfortaa-Bold",
  },
});
