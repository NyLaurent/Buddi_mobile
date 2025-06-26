import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FeedbackReport {
  id: string;
  reporterName: string;
  reporterAvatar: string;
  reportedDate: string;
  issueDescription: string;
  reportedBuddi: {
    name: string;
    email: string;
    avatar: string;
  };
  status: "Report" | "Resolved" | "Pending";
}

// Dummy data for feedback reports
const dummyReports: FeedbackReport[] = [
  {
    id: "1",
    reporterName: "Latoya Langosh",
    reporterAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    reportedDate: "12 May 2025",
    issueDescription:
      "Description of the issue by the parent reporting the issue",
    reportedBuddi: {
      name: "Brian Ford",
      email: "brianford@ok.com",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    status: "Report",
  },
  {
    id: "2",
    reporterName: "Sarah Johnson",
    reporterAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
    reportedDate: "11 May 2025",
    issueDescription:
      "Buddi was late for pickup and didn't communicate properly",
    reportedBuddi: {
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    status: "Pending",
  },
  {
    id: "3",
    reporterName: "Maria Garcia",
    reporterAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
    reportedDate: "10 May 2025",
    issueDescription: "Excellent service and very professional behavior",
    reportedBuddi: {
      name: "Alex Thompson",
      email: "alex.thompson@email.com",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    status: "Resolved",
  },
  {
    id: "4",
    reporterName: "David Chen",
    reporterAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
    reportedDate: "09 May 2025",
    issueDescription: "Communication issues during the pickup process",
    reportedBuddi: {
      name: "Emma Davis",
      email: "emma.davis@email.com",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    status: "Report",
  },
  {
    id: "5",
    reporterName: "Lisa Taylor",
    reporterAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
    reportedDate: "08 May 2025",
    issueDescription: "Very satisfied with the service provided",
    reportedBuddi: {
      name: "Ryan Martinez",
      email: "ryan.martinez@email.com",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    status: "Resolved",
  },
];

interface FeedbackReportCardProps {
  report: FeedbackReport;
  onViewProfile: () => void;
  onViewFeedback: () => void;
}

const FeedbackReportCard: React.FC<FeedbackReportCardProps> = ({
  report,
  onViewProfile,
  onViewFeedback,
}) => {
  const getStatusStyle = () => {
    switch (report.status) {
      case "Report":
        return { backgroundColor: "#FFEBEE", color: "#D32F2F" };
      case "Resolved":
        return { backgroundColor: "#E8F5E8", color: "#388E3C" };
      case "Pending":
        return { backgroundColor: "#FFF3E0", color: "#F57C00" };
      default:
        return { backgroundColor: "#F5F5F5", color: "#666" };
    }
  };

  return (
    <View style={styles.card}>
      {/* Reporter Info */}
      <View style={styles.reporterSection}>
        <Image
          source={{ uri: report.reporterAvatar }}
          style={styles.reporterAvatar}
        />
        <View style={styles.reporterInfo}>
          <View style={styles.reporterHeader}>
            <Text style={styles.reporterName}>{report.reporterName}</Text>
            <View style={[styles.statusBadge, getStatusStyle()]}>
              <Text
                style={[styles.statusText, { color: getStatusStyle().color }]}
              >
                {report.status}
              </Text>
            </View>
          </View>
          <Text style={styles.reportedDate}>
            Reported on {report.reportedDate}
          </Text>
        </View>
      </View>

      {/* Issue Description */}
      <View style={styles.issueSection}>
        <Text style={styles.issueTitle}>Issue Description</Text>
        <Text style={styles.issueDescription}>{report.issueDescription}</Text>
      </View>

      {/* Reported Buddi */}
      <View style={styles.buddiSection}>
        <Text style={styles.reportedBuddiLabel}>Reported Buddi</Text>
        <View style={styles.buddiInfo}>
          <Image
            source={{ uri: report.reportedBuddi.avatar }}
            style={styles.buddiAvatar}
          />
          <View style={styles.buddiDetails}>
            <Text style={styles.buddiName}>{report.reportedBuddi.name}</Text>
            <Text style={styles.buddiEmail}>{report.reportedBuddi.email}</Text>
          </View>
          <TouchableOpacity style={styles.chatButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#FF9500" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.profileButton} onPress={onViewProfile}>
          <Ionicons name="person" size={16} color="#666" />
          <Text style={styles.profileButtonText}>Profile</Text>
          <Ionicons name="arrow-forward" size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={onViewFeedback}
        >
          <Ionicons name="chatbubble" size={16} color="#fff" />
          <Text style={styles.feedbackButtonText}>Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main container component with pagination
const FeedbackReportsContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 3;

  // Filter reports based on search query
  const filteredReports = dummyReports.filter(
    (report) =>
      report.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBuddi.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.issueDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

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

  const handleViewProfile = (report: FeedbackReport) => {
    console.log("View profile for:", report.reportedBuddi.name);
  };

  const handleViewFeedback = (report: FeedbackReport) => {
    console.log("View feedback for:", report.id);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageNumber, currentPage === i && styles.activePage]}
          onPress={() => handlePageClick(i)}
        >
          <Text
            style={[
              styles.pageNumberText,
              currentPage === i && styles.activePageText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return pageNumbers;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Reports By Parents</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Click on a buddi to view details</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color="#666" />
          <Text style={styles.filterText}>Filter</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Feedback Report Cards */}
      {currentReports.map((report) => (
        <FeedbackReportCard
          key={report.id}
          report={report}
          onViewProfile={() => handleViewProfile(report)}
          onViewFeedback={() => handleViewFeedback(report)}
        />
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === 1 && styles.disabledButton,
            ]}
            onPress={handlePrevPage}
            disabled={currentPage === 1}
          >
            <Ionicons
              name="chevron-back"
              size={16}
              color={currentPage === 1 ? "#ccc" : "#666"}
            />
            <Text
              style={[
                styles.pageText,
                currentPage === 1 && styles.disabledText,
              ]}
            >
              Prev
            </Text>
          </TouchableOpacity>

          <View style={styles.pageNumbers}>{renderPageNumbers()}</View>

          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.disabledButton,
            ]}
            onPress={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <Text
              style={[
                styles.pageText,
                currentPage === totalPages && styles.disabledText,
              ]}
            >
              Next
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={currentPage === totalPages ? "#ccc" : "#666"}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Page Info */}
      <View style={styles.pageInfo}>
        <Text style={styles.pageInfoText}>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredReports.length)}{" "}
          of {filteredReports.length} reports
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  header: {
    marginBottom: 20,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    fontFamily: "Comfortaa-Regular",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#999",
    fontFamily: "Comfortaa-Regular",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 44,
    gap: 8,
  },
  filterText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 16,
  },
  reporterSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  reporterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0E7FF",
  },
  reporterInfo: {
    flex: 1,
  },
  reporterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  reporterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  reportedDate: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  issueSection: {
    marginBottom: 20,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 8,
    fontFamily: "Comfortaa-Regular",
  },
  issueDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontFamily: "Comfortaa-Regular",
  },
  buddiSection: {
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  reportedBuddiLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontFamily: "Comfortaa-Regular",
  },
  buddiInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buddiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E7FF",
  },
  buddiDetails: {
    flex: 1,
  },
  buddiName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  buddiEmail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontFamily: "Comfortaa-Regular",
  },
  chatButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  profileButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  profileButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  feedbackButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9500",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  feedbackButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  pageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  disabledText: {
    color: "#ccc",
  },
  pageNumbers: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageNumber: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  activePage: {
    backgroundColor: "#FF9500",
  },
  pageNumberText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  activePageText: {
    color: "#fff",
    fontWeight: "600",
  },
  pageInfo: {
    alignItems: "center",
    marginTop: 12,
  },
  pageInfoText: {
    fontSize: 12,
    color: "#999",
    fontFamily: "Comfortaa-Regular",
  },
});

export default FeedbackReportsContainer;
export { FeedbackReportCard };
