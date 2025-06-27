import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AnalyticsCard from "../commons/AnalyticsCard";
import CoverageAlertCard from "./CoverageAlertCard";

interface VideoReviewData {
  id: string;
  name: string;
  date: string;
  thumbnail: ImageSourcePropType;
  type: "interview" | "profile";
}

const AdminVideosInterviewsContainer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"interviews" | "videos">(
    "interviews"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Show 2 items per page

  const mockData: VideoReviewData[] = [
    {
      id: "1",
      name: "Brian Ford",
      date: "3 May 2024",
      thumbnail: require("../../assets/images/parent/no-buddi.png"),
      type: "interview",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      date: "2 May 2024",
      thumbnail: require("../../assets/images/parent/no-buddi.png"),
      type: "interview",
    },
    {
      id: "3",
      name: "Michael Chen",
      date: "1 May 2024",
      thumbnail: require("../../assets/images/parent/no-buddi.png"),
      type: "profile",
    },
    {
      id: "4",
      name: "Emma Wilson",
      date: "30 Apr 2024",
      thumbnail: require("../../assets/images/parent/no-buddi.png"),
      type: "interview",
    },
    {
      id: "5",
      name: "David Smith",
      date: "29 Apr 2024",
      thumbnail: require("../../assets/images/parent/no-buddi.png"),
      type: "profile",
    },
    {
      id: "6",
      name: "Lisa Brown",
      date: "28 Apr 2024",
      thumbnail: require("../../assets/images/parent/no-buddi.png"),
      type: "interview",
    },
  ];

  // Filter data based on active sub-tab and search query
  const filteredData = mockData.filter((item) => {
    const matchesTab =
      (activeSubTab === "interviews" && item.type === "interview") ||
      (activeSubTab === "videos" && item.type === "profile");

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleApprove = (id: string) => {
    console.log("Approve buddi:", id);
  };

  const handleReject = (id: string) => {
    console.log("Reject buddi:", id);
  };

  const renderVideoCard = (item: VideoReviewData) => (
    <View key={item.id} style={styles.videoCard}>
      <View style={styles.videoThumbnailContainer}>
        <Image source={item.thumbnail} style={styles.videoThumbnail} />
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={20} color="#fff" />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>3m 25s</Text>
        </View>
      </View>

      <View style={styles.videoInfo}>
        <View style={styles.videoDetails}>
          <View style={styles.avatarContainer}>
            <Image source={item.thumbnail} style={styles.avatar} />
          </View>
          <View style={styles.nameAndDate}>
            <Text style={styles.videoName}>{item.name}</Text>
            <Text style={styles.videoDate}>{item.date}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleReject(item.id)}
          >
            <Ionicons name="close" size={16} color="#FF4444" />
            <Text style={styles.rejectButtonText}>Reject Buddi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApprove(item.id)}
          >
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={styles.approveButtonText}>Approve Buddi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Analytics Cards Row */}
      <View style={styles.analyticsRow}>
        <View style={styles.cardContainer}>
          <AnalyticsCard
            icon={<Ionicons name="play-circle" size={36} color="#FF4444" />}
            title="Pending Interviews"
            value="12"
            subtitle="Pending"
          />
        </View>
        <View style={styles.cardContainer}>
          <AnalyticsCard
            icon={<Ionicons name="videocam" size={36} color="#9C27B0" />}
            title="Pending Profile Videos"
            value="12"
            subtitle="Pending"
          />
        </View>
      </View>

      {/* Coverage Alert */}
      <View style={styles.alertContainer}>
        <CoverageAlertCard
          title="Customize Buddi Screening Questions"
          subtitle="Create and manage the questions Buddis must answer during onboarding. Tailor your vetting process to fit your program's standards and ensure quality matches."
          description=""
          primaryButton={{
            label: "Manage Questions Bank",
            icon: <Ionicons name="arrow-forward" size={18} color="#fff" />,
            onPress: () => {
              console.log("Manage questions pressed");
            },
          }}
        />
      </View>

      {/* Sub-tab Switcher */}
      <View style={styles.subTabContainer}>
        <TouchableOpacity
          style={[
            styles.subTab,
            activeSubTab === "interviews" && styles.activeSubTab,
          ]}
          onPress={() => setActiveSubTab("interviews")}
        >
          <Text
            style={[
              styles.subTabText,
              activeSubTab === "interviews" && styles.activeSubTabText,
            ]}
          >
            Interviews
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.subTab,
            activeSubTab === "videos" && styles.activeSubTab,
          ]}
          onPress={() => setActiveSubTab("videos")}
        >
          <Text
            style={[
              styles.subTabText,
              activeSubTab === "videos" && styles.activeSubTabText,
            ]}
          >
            Profile Videos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8A8A8A" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8A8A8A"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="tune" size={20} color="#8A8A8A" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>
          {activeSubTab === "interviews"
            ? "Pending Interviews"
            : "Pending Profile Videos"}
        </Text>
        <Text style={styles.sectionSubtitle}>
          View and approve the pending videos added by buddis
        </Text>

        {/* Video Cards */}
        <View style={styles.videoList}>
          {currentData.map(renderVideoCard)}
          {currentData.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No{" "}
                {activeSubTab === "interviews"
                  ? "interviews"
                  : "profile videos"}{" "}
                found
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

            <View style={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <TouchableOpacity
                    key={page}
                    style={[
                      styles.pageNumber,
                      currentPage === page && styles.activePageNumber,
                    ]}
                    onPress={() => handlePageClick(page)}
                  >
                    <Text
                      style={[
                        styles.pageNumberText,
                        currentPage === page && styles.activePageNumberText,
                      ]}
                    >
                      {page}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

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

        {/* Page Info */}
        {filteredData.length > 0 && (
          <View style={styles.pageInfo}>
            <Text style={styles.pageInfoText}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)}{" "}
              of {filteredData.length} results
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cardContainer: {
    width: "48%",
  },
  alertContainer: {
    marginBottom: 24,
  },
  subTabContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 4,
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
    marginBottom: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  contentSection: {
    flex: 1,
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
  videoList: {
    flex: 1,
  },
  videoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    overflow: "hidden",
  },
  videoThumbnailContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    backgroundColor: "#000",
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  durationBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Comfortaa-Regular",
  },
  videoInfo: {
    padding: 16,
  },
  videoDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  nameAndDate: {
    flex: 1,
  },
  videoName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 2,
    fontFamily: "Comfortaa-Regular",
  },
  videoDate: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF4444",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 14,
    color: "#FF4444",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF932E",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  approveButtonText: {
    fontSize: 14,
    color: "#fff",
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
    fontSize: 14,
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
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  activePageNumberText: {
    color: "#fff",
    fontWeight: "600",
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
  pageInfo: {
    alignItems: "center",
    marginTop: 8,
  },
  pageInfoText: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
});

export default AdminVideosInterviewsContainer;
