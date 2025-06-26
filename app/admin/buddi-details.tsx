import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "@/components/commons/PageHeader";

interface BuddiApplicationDetails {
  id: string;
  name: string;
  gender: string;
  email: string;
  age: string;
  location: string;
  phone: string;
  currentSchool: string;
  areaOfStudy: string;
  graduationYear: string;
  gpa: string;
  reference: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  status: "Not yet reviewed" | "Approved" | "Rejected";
  avatar: string;
  submittedDate: string;
  resumeUrl?: string;
}

// Extended dummy data for detailed view
const getBuddiDetails = (id: string): BuddiApplicationDetails | null => {
  const buddiDetails: Record<string, BuddiApplicationDetails> = {
    "1": {
      id: "1",
      name: "Brian Ford",
      gender: "MALE",
      email: "brianford@ok.com",
      age: "22 years Old",
      location: "Current Location",
      phone: "+212 1234567",
      currentSchool: "School Name",
      areaOfStudy: "Oxford",
      graduationYear: "2026",
      gpa: "Not Specified",
      reference: {
        name: "Brian Ford",
        email: "brianford@ok.com",
        phone: "+212 1234567",
        role: "Head Teacher",
      },
      status: "Not yet reviewed",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      submittedDate: "Sunday 2 May 2025",
      resumeUrl: "sample-resume.pdf",
    },
    "2": {
      id: "2",
      name: "Sarah Johnson",
      gender: "FEMALE",
      email: "sarah.johnson@email.com",
      age: "22 years Old",
      location: "Boston, MA",
      phone: "+1 (555) 123-4567",
      currentSchool: "Harvard University",
      areaOfStudy: "Computer Science",
      graduationYear: "2025",
      gpa: "3.8",
      reference: {
        name: "Dr. Michael Smith",
        email: "m.smith@harvard.edu",
        phone: "+1 (555) 987-6543",
        role: "Professor",
      },
      status: "Not yet reviewed",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      submittedDate: "Monday 3 May 2025",
    },
  };

  return buddiDetails[id] || null;
};

const BuddiDetailsPage: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const buddi = getBuddiDetails(id as string);

  if (!buddi) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Buddi application not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusStyle = () => {
    switch (buddi.status) {
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

  const handleApprove = () => {
    console.log("Approve buddi:", buddi.id);
    // TODO: Implement approval logic
  };

  const handleReject = () => {
    console.log("Reject buddi:", buddi.id);
    // TODO: Implement rejection logic
  };

  const handleDownloadResume = () => {
    console.log("Download resume for:", buddi.id);
    // TODO: Implement resume download
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      
      {/* Header */}
      <View className="pt-6">
        <PageHeader title={`${buddi.name} (${buddi.gender})`} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Registration Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registration Details</Text>
          <Text style={styles.submittedDate}>
            Submitted on {buddi.submittedDate}
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
            <Text style={styles.searchPlaceholder}>Search</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="#666" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Main Details Card */}
        <View style={styles.detailsCard}>
          {/* Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Buddi</Text>
            <View style={[styles.statusBadge, getStatusStyle()]}>
              <Text
                style={[styles.statusText, { color: getStatusStyle().color }]}
              >
                {buddi.status}
              </Text>
            </View>
          </View>

          {/* Buddi Info */}
          <View style={styles.buddiInfo}>
            <Image source={{ uri: buddi.avatar }} style={styles.avatar} />
            <View style={styles.buddiDetails}>
              <Text style={styles.buddiName}>
                {buddi.name} ({buddi.gender})
              </Text>
              <Text style={styles.buddiAge}>Age</Text>
              <Text style={styles.buddiAgeValue}>{buddi.age}</Text>
            </View>
          </View>

          {/* Location Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Ionicons name="location" size={20} color="#4CAF50" />
                <Text style={styles.infoLabel}>Location</Text>
              </View>
              <Text style={styles.infoValue}>{buddi.location}</Text>
            </View>
            <View style={styles.phoneInfo}>
              <Ionicons name="call" size={16} color="#666" />
              <Text style={styles.phoneText}>{buddi.phone}</Text>
            </View>
          </View>

          {/* School Info Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Ionicons name="school" size={20} color="#2196F3" />
                <Text style={styles.infoLabel}>Current School</Text>
              </View>
              <Text style={styles.infoValue}>{buddi.currentSchool}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Area Of Study</Text>
              <Text style={styles.infoValue}>{buddi.areaOfStudy}</Text>
            </View>
          </View>

          {/* Graduation and GPA Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Graduation Year</Text>
              <Text style={styles.infoValue}>{buddi.graduationYear}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>GPA</Text>
              <Text style={styles.infoValue}>{buddi.gpa}</Text>
            </View>
          </View>

          {/* Reference Section */}
          <View style={styles.referenceSection}>
            <View style={styles.referenceHeader}>
              <Text style={styles.referenceLabel}>Reference</Text>
              <Text style={styles.referenceRole}>{buddi.reference.role}</Text>
            </View>

            <View style={styles.referenceInfo}>
              <Image
                source={{ uri: buddi.avatar }}
                style={styles.referenceAvatar}
              />
              <View style={styles.referenceDetails}>
                <Text style={styles.referenceName}>{buddi.reference.name}</Text>
                <Text style={styles.referenceEmail}>{buddi.reference.email}</Text>
              </View>
              <View style={styles.referenceActions}>
                <TouchableOpacity style={styles.phoneButton}>
                  <Ionicons name="call" size={16} color="#666" />
                  <Text style={styles.referencePhone}>
                    {buddi.reference.phone}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chatButton}>
                  <Ionicons name="chatbubble-outline" size={20} color="#FF9500" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
              <Text style={styles.rejectButtonText}>Reject</Text>
              <Ionicons name="close" size={16} color="#DC3545" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={handleApprove}
            >
              <Text style={styles.approveButtonText}>Approve</Text>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Resume Section */}
        {buddi.resumeUrl && (
          <View style={styles.resumeSection}>
            <Text style={styles.resumeTitle}>Resume</Text>
            <View style={styles.resumeCard}>
              <View style={styles.pdfIcon}>
                <Ionicons name="document" size={48} color="#DC3545" />
              </View>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownloadResume}
              >
                <Ionicons name="download" size={20} color="#FF9500" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    fontFamily: "Comfortaa-Regular",
  },
  backButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Comfortaa-Regular",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  submittedDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontFamily: "Comfortaa-Regular",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 8,
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
  detailsCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
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
  buddiInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0E7FF",
  },
  buddiDetails: {
    flex: 1,
  },
  buddiName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 8,
    fontFamily: "Comfortaa-Regular",
  },
  buddiAge: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontFamily: "Comfortaa-Regular",
  },
  buddiAgeValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontFamily: "Comfortaa-Regular",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  phoneInfo: {
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
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  referenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  referenceLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  referenceRole: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  referenceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
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
  referenceActions: {
    alignItems: "center",
    gap: 8,
  },
  phoneButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  referencePhone: {
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
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DC3545",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  rejectButtonText: {
    fontSize: 14,
    color: "#DC3545",
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
  resumeSection: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  resumeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 16,
    fontFamily: "Comfortaa-Regular",
  },
  resumeCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  pdfIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default BuddiDetailsPage;
