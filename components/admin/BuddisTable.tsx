import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface BuddiData {
  id: string;
  name: string;
  email: string;
  totalJobs: number;
  currentStatus: "Unemployed" | "Employed" | "Pending";
  rating: number;
}

interface BuddisTableProps {
  data: BuddiData[];
}

const BuddisTable: React.FC<BuddisTableProps> = ({ data }) => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name="star"
            size={16}
            color={star <= rating ? "#FF9500" : "#E0E0E0"}
          />
        ))}
      </View>
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Unemployed":
        return { backgroundColor: "#E3F2FD", color: "#1976D2" };
      case "Employed":
        return { backgroundColor: "#E8F5E8", color: "#388E3C" };
      case "Pending":
        return { backgroundColor: "#FFF3E0", color: "#F57C00" };
      default:
        return { backgroundColor: "#F5F5F5", color: "#666" };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>All Buddis</Text>
          <Text style={styles.subtitle}>Click on a buddi to view details</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
        </TouchableOpacity>
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
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color="#666" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Table */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tableContainer}
      >
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.nameColumn}>
              <Text style={styles.headerText}>Name</Text>
            </View>
            <View style={styles.jobsColumn}>
              <Text style={styles.headerText}>Total Jobs & Current Status</Text>
            </View>
          </View>

          {/* Table Rows */}
          {currentData.map((item) => (
            <TouchableOpacity key={item.id} style={styles.tableRow}>
              <View style={styles.nameColumn}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                    {renderStars(item.rating)}
                  </View>
                </View>
              </View>
              <View style={styles.jobsColumn}>
                <View style={styles.jobsInfo}>
                  <Text style={styles.jobsNumber}>{item.totalJobs}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      getStatusStyle(item.currentStatus),
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusStyle(item.currentStatus).color },
                      ]}
                    >
                      {item.currentStatus}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Pagination */}
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === 1 && styles.disabledButton,
          ]}
          onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={currentPage === 1 ? "#ccc" : "#666"}
          />
          <Text
            style={[styles.pageText, currentPage === 1 && styles.disabledText]}
          >
            Prev
          </Text>
        </TouchableOpacity>

        <View style={styles.pageNumbers}>
          {[1, 2, 3, 4, 5, 6].slice(0, totalPages).map((page) => (
            <TouchableOpacity
              key={page}
              style={[
                styles.pageNumber,
                currentPage === page && styles.activePage,
              ]}
              onPress={() => setCurrentPage(page)}
            >
              <Text
                style={[
                  styles.pageNumberText,
                  currentPage === page && styles.activePageText,
                ]}
              >
                {page}
              </Text>
            </TouchableOpacity>
          ))}
          {totalPages > 6 && <Text style={styles.ellipsis}>...</Text>}
        </View>

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
          onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    color: "#999",
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#23272F",
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
  tableContainer: {
    marginBottom: 20,
  },
  table: {
    minWidth: 600,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 12,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F9FA",
  },
  nameColumn: {
    width: 300,
  },
  jobsColumn: {
    width: 300,
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
    fontFamily: "Comfortaa-Regular",
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontFamily: "Comfortaa-Regular",
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 4,
    gap: 2,
  },
  jobsInfo: {
    alignItems: "center",
    gap: 8,
  },
  jobsNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#23272F",
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
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    backgroundColor: "#4F46E5",
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
  ellipsis: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
});

export default BuddisTable;
