import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BuddiApplicationData {
  id: string;
  name: string;
  gender: string;
  email: string;
  age: string;
  school: string;
  schoolName: string;
  phone: string;
  reference: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  status: "Not yet reviewed" | "Approved" | "Rejected" | "submissionApproved";
  avatar: string;
}

// Dummy data for multiple applications
const dummyApplications: BuddiApplicationData[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    gender: "Female",
    email: "sarah.johnson@email.com",
    age: "22",
    school: "University",
    schoolName: "Harvard University",
    phone: "+1 (555) 123-4567",
    reference: {
      name: "Dr. Michael Smith",
      email: "m.smith@harvard.edu",
      phone: "+1 (555) 987-6543",
      role: "Professor",
    },
    status: "Not yet reviewed",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    name: "James Wilson",
    gender: "Male",
    email: "james.wilson@email.com",
    age: "21",
    school: "College",
    schoolName: "MIT",
    phone: "+1 (555) 234-5678",
    reference: {
      name: "Prof. Emily Davis",
      email: "e.davis@mit.edu",
      phone: "+1 (555) 876-5432",
      role: "Department Head",
    },
    status: "Approved",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "3",
    name: "Maria Garcia",
    gender: "Female",
    email: "maria.garcia@email.com",
    age: "23",
    school: "University",
    schoolName: "Stanford University",
    phone: "+1 (555) 345-6789",
    reference: {
      name: "Dr. Robert Brown",
      email: "r.brown@stanford.edu",
      phone: "+1 (555) 765-4321",
      role: "Academic Advisor",
    },
    status: "Rejected",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "4",
    name: "David Chen",
    gender: "Male",
    email: "david.chen@email.com",
    age: "20",
    school: "College",
    schoolName: "UCLA",
    phone: "+1 (555) 456-7890",
    reference: {
      name: "Dr. Lisa Taylor",
      email: "l.taylor@ucla.edu",
      phone: "+1 (555) 654-3210",
      role: "Professor",
    },
    status: "Not yet reviewed",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: "5",
    name: "Emma Thompson",
    gender: "Female",
    email: "emma.thompson@email.com",
    age: "22",
    school: "University",
    schoolName: "Yale University",
    phone: "+1 (555) 567-8901",
    reference: {
      name: "Prof. John Anderson",
      email: "j.anderson@yale.edu",
      phone: "+1 (555) 543-2109",
      role: "Department Chair",
    },
    status: "Approved",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: "6",
    name: "Alex Rodriguez",
    gender: "Male",
    email: "alex.rodriguez@email.com",
    age: "21",
    school: "College",
    schoolName: "Princeton University",
    phone: "+1 (555) 678-9012",
    reference: {
      name: "Dr. Susan White",
      email: "s.white@princeton.edu",
      phone: "+1 (555) 432-1098",
      role: "Research Director",
    },
    status: "Not yet reviewed",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: "7",
    name: "Olivia Martin",
    gender: "Female",
    email: "olivia.martin@email.com",
    age: "23",
    school: "University",
    schoolName: "Columbia University",
    phone: "+1 (555) 789-0123",
    reference: {
      name: "Prof. Mark Johnson",
      email: "m.johnson@columbia.edu",
      phone: "+1 (555) 321-0987",
      role: "Associate Professor",
    },
    status: "Approved",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: "8",
    name: "Ryan Lee",
    gender: "Male",
    email: "ryan.lee@email.com",
    age: "20",
    school: "College",
    schoolName: "University of Chicago",
    phone: "+1 (555) 890-1234",
    reference: {
      name: "Dr. Jennifer Wilson",
      email: "j.wilson@uchicago.edu",
      phone: "+1 (555) 210-9876",
      role: "Senior Lecturer",
    },
    status: "Rejected",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },
];

interface AdminBuddiApplicationCardProps {
  application: BuddiApplicationData;
  onViewDetails: () => void;
  onApprove: () => void;
}

const AdminBuddiApplicationCard: React.FC<AdminBuddiApplicationCardProps> = ({
  application,
  onViewDetails,
  onApprove,
}) => {
  const getStatusStyle = () => {
    switch (application.status) {
      case "Not yet reviewed":
        return { backgroundColor: "#E3F2FD", color: "#1976D2" };
      case "Approved":
        return { backgroundColor: "#E8F5E8", color: "#388E3C" };
      case "Rejected":
        return { backgroundColor: "#FFEBEE", color: "#D32F2F" };
      default:
        return { backgroundColor: "#F5F5F5", color: "#666" };
    }
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Buddi Application</Text>
          <Text style={styles.cardSubtitle}>
            Click on a buddi to view details
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Status Badge */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Buddi</Text>
        <View style={[styles.statusBadge, getStatusStyle()]}>
          <Text style={[styles.statusText, { color: getStatusStyle().color }]}>
            {application.status}
          </Text>
        </View>
      </View>

      {/* Buddi Information Section */}
      <View style={styles.buddiSection}>
        <View style={styles.userInfo}>
          <Image source={{ uri: application.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {application.name} ({application.gender})
            </Text>
            <Text style={styles.userEmail}>{application.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age</Text>
          <Text style={styles.infoValue}>{application.age}</Text>
        </View>

        <View style={styles.schoolInfo}>
          <Ionicons
            name="business"
            size={20}
            color="#4F46E5"
            style={styles.schoolIcon}
          />
          <View style={styles.schoolDetails}>
            <Text style={styles.schoolType}>{application.school}</Text>
            <Text style={styles.schoolName}>{application.schoolName}</Text>
          </View>
          <View style={styles.phoneContainer}>
            <Ionicons name="call" size={16} color="#666" />
            <Text style={styles.phoneText}>{application.phone}</Text>
          </View>
        </View>
      </View>

      {/* Reference Section - Now under buddi data */}
      <View style={styles.referenceSection}>
        <Text style={styles.referenceLabel}>Reference</Text>
        <Text style={styles.referenceRole}>{application.reference.role}</Text>

        <View style={styles.referenceInfo}>
          <Image
            source={{ uri: application.avatar }}
            style={styles.referenceAvatar}
          />
          <View style={styles.referenceDetails}>
            <Text style={styles.referenceName}>
              {application.reference.name}
            </Text>
            <Text style={styles.referenceEmail}>
              {application.reference.email}
            </Text>
          </View>
          <TouchableOpacity style={styles.chatButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#FF9500" />
          </TouchableOpacity>
        </View>

        <View style={styles.referencePhone}>
          <Ionicons name="call" size={16} color="#666" />
          <Text style={styles.referencePhoneText}>
            {application.reference.phone}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.viewButton} onPress={onViewDetails}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.approveButton} onPress={onApprove}>
          <Text style={styles.approveButtonText}>Approve</Text>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main container component with pagination
const AdminBuddiApplicationsContainer: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 3;

  // Only show applications with status 'submissionApproved' and real data
  const reliableSubmissionApprovedApplications = dummyApplications.filter(
    (app) =>
      app.status === "submissionApproved" &&
      app.name &&
      app.email &&
      app.phone &&
      app.gender &&
      app.age &&
      app.school &&
      app.schoolName &&
      app.avatar
  );

  // Filter applications based on search query
  const filteredApplications = reliableSubmissionApprovedApplications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

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

  const handleViewDetails = (application: BuddiApplicationData) => {
    router.push({
      pathname: "/admin/buddi-details",
      params: { id: application.id },
    });
  };

  const handleApprove = (application: BuddiApplicationData) => {
    console.log("Approve application for:", application.name);
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
        <Text style={styles.title}>
          All Pending Buddi Registration Requests
        </Text>
        <Text style={styles.subtitle}>
          Total: {filteredApplications.length} applications
        </Text>
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
          <Text style={styles.searchPlaceholder}>Search applications...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color="#666" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Application Cards */}
      {currentApplications.map((application) => (
        <AdminBuddiApplicationCard
          key={application.id}
          application={application}
          onViewDetails={() => handleViewDetails(application)}
          onApprove={() => handleApprove(application)}
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
          Showing {startIndex + 1}-
          {Math.min(endIndex, filteredApplications.length)} of{" "}
          {filteredApplications.length} applications
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
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
    fontFamily: "Comfortaa-Regular",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  buddiSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0E7FF",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontFamily: "Comfortaa-Regular",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  schoolInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  schoolIcon: {
    marginRight: 4,
  },
  schoolDetails: {
    flex: 1,
  },
  schoolType: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  schoolName: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  phoneText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  referenceSection: {
    marginBottom: 20,
  },
  referenceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontFamily: "Comfortaa-Regular",
  },
  referenceRole: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    marginBottom: 16,
    fontFamily: "Comfortaa-Regular",
  },
  referenceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  referenceAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E7FF",
  },
  referenceDetails: {
    flex: 1,
  },
  referenceName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  referenceEmail: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    fontFamily: "Comfortaa-Regular",
  },
  referencePhone: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  referencePhoneText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  chatButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  viewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  viewButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  approveButtonText: {
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
    backgroundColor: "#007BFF",
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

export default AdminBuddiApplicationsContainer;
export { AdminBuddiApplicationCard };
