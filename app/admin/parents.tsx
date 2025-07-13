import ParentsTable from "@/components/admin/ParentsTable";
import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import { ParentRecord, ParentService } from "@/services/api";
import { authorizedApi } from "@/services/api/config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface Child {
  name: string;
  age: number;
  school: string;
}

interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  children: Child[];
  status: "Active" | "Pending";
  joinDate: string;
  totalPickups: number;
  currentBuddi: string | null;
}

interface ParentCardProps {
  parent: Parent;
  onViewDetails: () => void;
  onMessage: () => void;
}

// Mock data for Parents
const parentsList: Parent[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 234 567 8901",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    children: [
      { name: "Emma Johnson", age: 8, school: "Lincoln Elementary" },
      { name: "Jake Johnson", age: 10, school: "Lincoln Elementary" },
    ],
    status: "Active",
    joinDate: "Jan 15, 2024",
    totalPickups: 45,
    currentBuddi: "John Smith",
  },
  {
    id: "2",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 234 567 8902",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    children: [{ name: "Olivia Brown", age: 7, school: "Oak Elementary" }],
    status: "Active",
    joinDate: "Feb 20, 2024",
    totalPickups: 28,
    currentBuddi: "Emma Davis",
  },
  {
    id: "3",
    name: "Jennifer Davis",
    email: "jennifer.davis@email.com",
    phone: "+1 234 567 8903",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    children: [
      { name: "Liam Davis", age: 9, school: "St. Mary's School" },
      { name: "Sofia Davis", age: 6, school: "St. Mary's School" },
    ],
    status: "Pending",
    joinDate: "Mar 10, 2024",
    totalPickups: 12,
    currentBuddi: null,
  },
];

const ParentCard = ({ parent, onViewDetails, onMessage }: ParentCardProps) => {
  const statusColor = parent.status === "Active" ? "#10B981" : "#F59E0B";
  const statusBg = parent.status === "Active" ? "#D1FAE5" : "#FEF3C7";

  return (
    <View className="bg-white rounded-xl p-4 mx-4 mb-4 border border-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: parent.image }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="font-comfortaa-bold text-lg text-black">
              {parent.name}
            </Text>
            <Text className="font-comfortaa text-gray text-sm">
              {parent.email}
            </Text>
          </View>
        </View>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: statusBg }}
        >
          <Text
            className="font-comfortaa-bold text-xs"
            style={{ color: statusColor }}
          >
            {parent.status}
          </Text>
        </View>
      </View>

      {/* Phone */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="call" size={16} color="#6B7280" />
        <Text className="font-comfortaa text-gray ml-2">{parent.phone}</Text>
      </View>

      {/* Children */}
      <View className="mb-3">
        <Text className="font-comfortaa-bold text-sm text-gray mb-2">
          Children ({parent.children.length})
        </Text>
        {parent.children.map((child, index) => (
          <View key={index} className="flex-row items-center mb-1">
            <View className="w-2 h-2 bg-primary rounded-full mr-2" />
            <Text className="font-comfortaa text-gray text-sm flex-1">
              {child.name}, {child.age} years • {child.school}
            </Text>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View className="flex-row items-center justify-between mb-3 bg-gray-50 rounded-lg p-3">
        <View className="flex-1">
          <Text className="font-comfortaa text-xs text-gray">Joined</Text>
          <Text className="font-comfortaa-bold text-sm text-gray">
            {parent.joinDate}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-comfortaa text-xs text-gray">
            Total Pickups
          </Text>
          <Text className="font-comfortaa-bold text-sm text-gray">
            {parent.totalPickups}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-comfortaa text-xs text-gray">
            Current Buddi
          </Text>
          <Text className="font-comfortaa-bold text-sm text-gray">
            {parent.currentBuddi || "Not Assigned"}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={onViewDetails}
          className="flex-1 bg-gray-100 rounded-lg py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="eye-outline" size={16} color="#4B5563" />
          <Text className="font-comfortaa text-gray ml-2 text-sm">
            View Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onMessage}
          className="flex-1 bg-primary rounded-lg py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="chatbubble-outline" size={16} color="white" />
          <Text className="font-comfortaa text-white ml-2 text-sm">
            Message
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AdminParentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Parent table state
  const [parentData, setParentData] = useState<ParentRecord[]>([]);
  const [parentCurrentPage, setParentCurrentPage] = useState(1);
  const [parentTotalPages, setParentTotalPages] = useState(1);
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState("");

  // Modal state for approval/rejection
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentRecord | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const handleActionClick = (parent: ParentRecord) => {
    router.push({
      pathname: "/admin/parent-details/[id]",
      params: { id: parent.id },
    });
  };

  const handleApprove = async () => {
    if (!selectedParent) return;
    setActionLoading(true);
    setActionError("");
    try {
      await authorizedApi.patch(`/parent/${selectedParent.id}/approval`, {
        status: "approved",
      });
      setActionSuccess("Parent approved successfully.");
      setTimeout(() => {
        setModalVisible(false);
        setSelectedParent(null);
        setActionSuccess("");
        // Refresh table
        ParentService.getAllParents(parentCurrentPage, 10).then((res) => {
          setParentData(res.data || []);
          setParentTotalPages(res.totalPages || 1);
        });
      }, 1000);
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to approve parent."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedParent) return;
    setActionLoading(true);
    setActionError("");
    try {
      await authorizedApi.patch(`/parent/${selectedParent.id}/approval`, {
        status: "rejected",
      });
      setActionSuccess("Parent rejected successfully.");
      setTimeout(() => {
        setModalVisible(false);
        setSelectedParent(null);
        setActionSuccess("");
        // Refresh table
        ParentService.getAllParents(parentCurrentPage, 10).then((res) => {
          setParentData(res.data || []);
          setParentTotalPages(res.totalPages || 1);
        });
      }, 1000);
    } catch (err: any) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reject parent."
      );
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "all") return;
    setParentLoading(true);
    setParentError("");
    ParentService.getAllParents(parentCurrentPage, 10)
      .then((res) => {
        setParentData(res.data || []);
        setParentTotalPages(res.totalPages || 1);
      })
      .catch((err) => {
        setParentError(err?.message || "Failed to fetch parents");
      })
      .finally(() => setParentLoading(false));
  }, [parentCurrentPage, activeTab]);

  const filteredParents = parentsList.filter((parent) => {
    const matchesSearch =
      parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
        hidden={false}
        animated={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        {/* Header */}
        <View className="pt-6">
          <PageHeader
            title="Parents Overview"
            showBackButton={true}
            showMenuButton={true}
            onMenuPress={() => console.log("Menu pressed")}
          />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.activeTabText,
              ]}
            >
              All Parents
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "background" && styles.activeTab]}
            onPress={() => setActiveTab("background")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "background" && styles.activeTabText,
              ]}
            >
              Background Checks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Analytics Cards - 2x2 Grid */}
        {activeTab === "all" && (
          <>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                marginBottom: 24,
              }}
            >
              <View style={{ width: "48%", marginBottom: 12 }}>
                <AnalyticsCard
                  icon={<Ionicons name="flash" size={36} color="#29B6F6" />}
                  title="Total Parents"
                  value="12"
                  subtitle="2 Schools"
                />
              </View>
              <View style={{ width: "48%", marginBottom: 12 }}>
                <AnalyticsCard
                  icon={
                    <Ionicons name="cash-outline" size={36} color="#5B4DF7" />
                  }
                  title="Pending Approval"
                  value="3"
                  subtitle="All time"
                />
              </View>
              <View style={{ width: "48%", marginBottom: 12 }}>
                <AnalyticsCard
                  icon={<Ionicons name="people" size={36} color="#FF4D67" />}
                  title="Feedbacks by Parents"
                  value="3"
                  subtitle="Connected"
                />
              </View>
              <View style={{ width: "48%", marginBottom: 12 }}>
                <AnalyticsCard
                  icon={
                    <Ionicons name="person-circle" size={36} color="#B36AFF" />
                  }
                  title="Pending Approval"
                  value="2"
                  subtitle="2 Schools"
                />
              </View>
            </View>
            {/* <CoverageAlertCard
              title="21 Buddis Need Coverage For Today"
              subtitle="Review this before effects!"
              description="Please review Buddis requesting coverage to ensure availability and reliability."
              primaryButton={{
                label: "Handle Coverages",
                icon: <Ionicons name="reload" size={20} color="#fff" />,
                onPress: () => {
                  // TODO: Add navigation or action here
                },
              }}
            /> */}
            {/* Parent Table */}
            {parentLoading ? (
              <Text style={{ textAlign: "center", marginTop: 24 }}>
                Loading...
              </Text>
            ) : parentError ? (
              <Text
                style={{ textAlign: "center", color: "red", marginTop: 24 }}
              >
                {parentError}
              </Text>
            ) : (
              <ParentsTable
                data={parentData.filter((p) => p.User)}
                currentPage={parentCurrentPage}
                totalPages={parentTotalPages}
                onPageChange={setParentCurrentPage}
                onActionClick={handleActionClick}
              />
            )}
          </>
        )}

        {/* Background Checks Tab Content */}
        {activeTab === "background" && (
          <View className="bg-white rounded-xl p-8 mx-4 items-center">
            <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
            <Text className="font-comfortaa-bold text-lg text-gray mt-4">
              Background Checks
            </Text>
            <Text className="font-comfortaa text-gray text-center mt-2">
              Background check management coming soon
            </Text>
          </View>
        )}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setModalVisible(false);
            setSelectedParent(null);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 24,
                width: 320,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#23272F",
                  marginBottom: 8,
                }}
              >
                {selectedParent
                  ? `${selectedParent.User?.firstName} ${selectedParent.User?.lastName}`
                  : ""}
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 15,
                  color: "#666",
                  marginBottom: 16,
                }}
              >
                What action would you like to take?
              </Text>
              {actionError ? (
                <Text style={{ color: "#FF4D67", marginBottom: 8 }}>
                  {actionError}
                </Text>
              ) : null}
              {actionSuccess ? (
                <Text style={{ color: "#10B981", marginBottom: 8 }}>
                  {actionSuccess}
                </Text>
              ) : null}
              <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#10B981",
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    marginRight: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={handleApprove}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator color="#fff" size={18} />
                  ) : (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 15,
                    }}
                  >
                    Approve
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FF4D67",
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={handleReject}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <ActivityIndicator color="#fff" size={18} />
                  ) : (
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 15,
                    }}
                  >
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{ marginTop: 18 }}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedParent(null);
                }}
                disabled={actionLoading}
              >
                <Text
                  style={{
                    color: "#666",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 15,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  activeTabText: {
    color: "#23272F",
    fontWeight: "600",
  },
  analyticsGrid: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  analyticsRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    position: "relative",
  },
  cardMenu: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardStats: {
    flex: 1,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#23272F",
    fontFamily: "Comfortaa-Bold",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
});
