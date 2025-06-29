import AutoResolvedCard from "@/components/admin/AutoResolvedCard";
import BackupRequestCard from "@/components/admin/BackupRequestCard";
import CoverageAlertCard from "@/components/admin/CoverageAlertCard";
import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface BackupRequest {
  id: string;
  name: string;
  email: string;
  timeRemaining: string;
  daysPerWeek: string;
  buddyName: string;
  buddyEmail: string;
  buddyStatus: "available" | "unavailable";
  schoolName: string;
  location: string;
  notificationCount: number;
  status: "pending" | "resolved";
  // Fields for auto-resolved cards
  defaultBuddyName?: string;
  defaultBuddyEmail?: string;
  coverageBuddyName?: string;
  coverageBuddyEmail?: string;
  coverageBuddyRank?: string;
}

export default function BackupRequestsPage() {
  const [activeSubTab, setActiveSubTab] = useState<"unresolved" | "resolved">(
    "unresolved"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const mockData: BackupRequest[] = [
    {
      id: "1",
      name: "Bryan Smith",
      email: "bryan@example.com",
      timeRemaining: "2:23:04",
      daysPerWeek: "5 Days a Week",
      buddyName: "Brian Ford",
      buddyEmail: "brianford@iok.com",
      buddyStatus: "unavailable",
      schoolName: "School Name",
      location: "Senen",
      notificationCount: 3,
      status: "pending",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      timeRemaining: "1:45:30",
      daysPerWeek: "3 Days a Week",
      buddyName: "Michael Chen",
      buddyEmail: "michael@example.com",
      buddyStatus: "available",
      schoolName: "Lincoln Elementary",
      location: "Downtown",
      notificationCount: 2,
      status: "pending",
    },
    {
      id: "3",
      name: "Bryan Smith",
      email: "bryan@example.com",
      timeRemaining: "2:23:04",
      daysPerWeek: "5 Days a Week",
      buddyName: "Brian Ford",
      buddyEmail: "brianford@iok.com",
      buddyStatus: "unavailable",
      schoolName: "School Name",
      location: "Senen",
      notificationCount: 3,
      status: "resolved",
      defaultBuddyName: "Brian Ford",
      defaultBuddyEmail: "brianford@iok.com",
      coverageBuddyName: "Brian Ford",
      coverageBuddyEmail: "brianford@iok.com",
      coverageBuddyRank: "2nd",
    },
    {
      id: "4",
      name: "Lisa Brown",
      email: "lisa@example.com",
      timeRemaining: "3:10:22",
      daysPerWeek: "4 Days a Week",
      buddyName: "James Wilson",
      buddyEmail: "james@example.com",
      buddyStatus: "unavailable",
      schoolName: "Jefferson Elementary",
      location: "Westside",
      notificationCount: 4,
      status: "resolved",
      defaultBuddyName: "James Wilson",
      defaultBuddyEmail: "james@example.com",
      coverageBuddyName: "Maria Garcia",
      coverageBuddyEmail: "maria@example.com",
      coverageBuddyRank: "3rd",
    },
    {
      id: "5",
      name: "Mark Taylor",
      email: "mark@example.com",
      timeRemaining: "4:25:10",
      daysPerWeek: "5 Days a Week",
      buddyName: "Anna Martinez",
      buddyEmail: "anna@example.com",
      buddyStatus: "available",
      schoolName: "Washington High",
      location: "Eastside",
      notificationCount: 2,
      status: "pending",
    },
    {
      id: "6",
      name: "Jennifer Davis",
      email: "jennifer@example.com",
      timeRemaining: "2:15:45",
      daysPerWeek: "3 Days a Week",
      buddyName: "Robert Johnson",
      buddyEmail: "robert@example.com",
      buddyStatus: "unavailable",
      schoolName: "Central High",
      location: "Midtown",
      notificationCount: 1,
      status: "resolved",
      defaultBuddyName: "Robert Johnson",
      defaultBuddyEmail: "robert@example.com",
      coverageBuddyName: "Sarah Wilson",
      coverageBuddyEmail: "sarah@example.com",
      coverageBuddyRank: "1st",
    },
  ];

  // Filter data based on active sub-tab and search query
  const filteredData = mockData.filter((item) => {
    const matchesTab =
      (activeSubTab === "unresolved" && item.status === "pending") ||
      (activeSubTab === "resolved" && item.status === "resolved");

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buddyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.schoolName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when switching tabs or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubTab, searchQuery]);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show smart pagination like in the image: 1 2 ... 5 6
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, 2, "...", totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, 2, "...", currentPage, "...", totalPages);
      }
    }

    return pageNumbers.map((page, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.pageNumber,
          page === currentPage && styles.activePageNumber,
        ]}
        onPress={() => {
          if (typeof page === "number") {
            handlePageClick(page);
          }
        }}
        disabled={page === "..."}
      >
        <Text
          style={[
            styles.pageNumberText,
            page === currentPage && styles.activePageNumberText,
            page === "..." && styles.ellipsisPage,
          ]}
        >
          {page}
        </Text>
      </TouchableOpacity>
    ));
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
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="pt-6">
          <PageHeader
            title="Backup Requests"
            showBackButton={true}
            showMenuButton={true}
            onMenuPress={() => {
              console.log("Menu pressed");
            }}
          />
        </View>

        {/* Analytics Cards */}
        <View style={styles.analyticsRow}>
          <View style={styles.cardContainer}>
            <AnalyticsCard
              icon={<Ionicons name="alert-circle" size={36} color="#FF4444" />}
              title="Unresolved Requests"
              value="12"
              subtitle="2 Schools"
            />
          </View>
          <View style={styles.cardContainer}>
            <AnalyticsCard
              icon={<Ionicons name="people" size={36} color="#2196F3" />}
              title="Free Buddi"
              value="23"
              subtitle="23 Buddis"
            />
          </View>
        </View>

        {/* Alert Section */}
        <View style={styles.alertContainer}>
          <CoverageAlertCard
            title="Some buddi are missing frequently!"
            subtitle="Ensure a seamless customer care by handling this."
            description=""
            primaryButton={{
              label: "View Absent Buddis",
              icon: <Ionicons name="arrow-forward" size={18} color="#fff" />,
              onPress: () => {
                console.log("View frequently absent buddis");
              },
            }}
          />
        </View>

        {/* Sub-tab Switcher */}
        <View style={styles.subTabContainer}>
          <TouchableOpacity
            style={[
              styles.subTab,
              activeSubTab === "unresolved" && styles.activeSubTab,
            ]}
            onPress={() => setActiveSubTab("unresolved")}
          >
            <Text
              style={[
                styles.subTabText,
                activeSubTab === "unresolved" && styles.activeSubTabText,
              ]}
            >
              Unresolved Requests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.subTab,
              activeSubTab === "resolved" && styles.activeSubTab,
            ]}
            onPress={() => setActiveSubTab("resolved")}
          >
            <Text
              style={[
                styles.subTabText,
                activeSubTab === "resolved" && styles.activeSubTabText,
              ]}
            >
              Auto Resolved
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color="#8A8A8A" />
            <Text style={styles.searchPlaceholder}>Search</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={16} color="#8A8A8A" />
            <Text style={styles.filterText}>Filter</Text>
            <Ionicons name="chevron-down" size={12} color="#8A8A8A" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>
            {activeSubTab === "unresolved"
              ? "All Backup requests"
              : "Auto Resolved Absences"}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {activeSubTab === "unresolved"
              ? "Handle Back-ups"
              : "Automatically handled by the system"}
          </Text>

          {/* Request Cards */}
          <View style={styles.requestsList}>
            {currentData.map((request) =>
              activeSubTab === "unresolved" ? (
                <BackupRequestCard
                  key={request.id}
                  id={request.id}
                  name={request.name}
                  timeRemaining={request.timeRemaining}
                  daysPerWeek={request.daysPerWeek}
                  buddyName={request.buddyName}
                  buddyEmail={request.buddyEmail}
                  buddyAvatar={require("../../assets/images/parent/no-buddi.png")}
                  buddyStatus={request.buddyStatus}
                  schoolName={request.schoolName}
                  location={request.location}
                  notificationCount={request.notificationCount}
                  status={request.status}
                  onViewDetails={() =>
                    console.log("View details for", request.id)
                  }
                  onFindBackup={() =>
                    console.log("Find backup for", request.id)
                  }
                />
              ) : (
                <AutoResolvedCard
                  key={request.id}
                  id={request.id}
                  name={request.name}
                  timeRemaining={request.timeRemaining}
                  daysPerWeek={request.daysPerWeek}
                  defaultBuddyName={
                    request.defaultBuddyName || request.buddyName
                  }
                  defaultBuddyEmail={
                    request.defaultBuddyEmail || request.buddyEmail
                  }
                  defaultBuddyAvatar={require("../../assets/images/parent/no-buddi.png")}
                  coverageBuddyName={
                    request.coverageBuddyName || request.buddyName
                  }
                  coverageBuddyEmail={
                    request.coverageBuddyEmail || request.buddyEmail
                  }
                  coverageBuddyAvatar={require("../../assets/images/parent/no-buddi.png")}
                  coverageBuddyRank={request.coverageBuddyRank || "2nd"}
                  schoolName={request.schoolName}
                  location={request.location}
                  onViewTrip={() => console.log("View trip for", request.id)}
                />
              )
            )}
            {currentData.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No {activeSubTab} requests found
                </Text>
              </View>
            )}
          </View>

          {/* Pagination */}
          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
                onPress={handlePrevPage}
                disabled={currentPage === 1}
              >
                <Ionicons
                  name="chevron-back"
                  size={16}
                  color={currentPage === 1 ? "#CCCCCC" : "#8A8A8A"}
                />
                <Text
                  style={[
                    styles.paginationText,
                    currentPage === 1 && styles.disabledText,
                  ]}
                >
                  Prev
                </Text>
              </TouchableOpacity>

              <View style={styles.pageNumbers}>{renderPageNumbers()}</View>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === totalPages && styles.disabledButton,
                ]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Text
                  style={[
                    styles.paginationText,
                    currentPage === totalPages && styles.disabledText,
                  ]}
                >
                  Next
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={currentPage === totalPages ? "#CCCCCC" : "#8A8A8A"}
                />
              </TouchableOpacity>
            </View>
          )}
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
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  cardContainer: {
    width: "48%",
  },
  alertContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  subTabContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  subTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeSubTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  activeSubTabText: {
    color: "#23272F",
    fontWeight: "600",
  },
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  searchPlaceholder: {
    color: "#8A8A8A",
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  filterText: {
    fontSize: 12,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  contentSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 4,
    fontFamily: "Comfortaa-Regular",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#8A8A8A",
    marginBottom: 20,
    fontFamily: "Comfortaa-Regular",
  },
  requestsList: {
    gap: 16,
  },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  statusBadge: {
    backgroundColor: "#FF932E",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  requestDetails: {
    marginBottom: 16,
  },
  schoolInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  schoolName: {
    fontSize: 12,
    color: "#2196F3",
    fontFamily: "Comfortaa-Regular",
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  viewDetailsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  viewDetailsText: {
    fontSize: 10,
    color: "#8A8A8A",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  findBackupButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF932E",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  findBackupText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  resolvedButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  resolvedText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingVertical: 16,
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  paginationText: {
    fontSize: 10,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  pageNumbers: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    gap: 8,
  },
  pageNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  activePageNumber: {
    backgroundColor: "#FF932E",
  },
  pageNumberText: {
    fontSize: 11,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  activePageNumberText: {
    color: "#fff",
    fontWeight: "600",
  },
  ellipsis: {
    fontSize: 11,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#CCCCCC",
  },
  ellipsisPage: {
    color: "#CCCCCC",
  },
});
