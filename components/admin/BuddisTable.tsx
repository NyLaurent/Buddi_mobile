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
  status: string;
  areaOfStudy: string;
  currentSchool: string;
}

interface BuddisTableProps {
  data: BuddiData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onActionClick?: (buddi: BuddiData) => void;
}

const BuddisTable: React.FC<BuddisTableProps> = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onActionClick,
}) => {
  const [searchText, setSearchText] = useState("");

  const filteredData = data.filter(
    (item) =>
      (item.name ? item.name.toLowerCase() : "").includes(
        searchText.toLowerCase()
      ) ||
      (item.email ? item.email.toLowerCase() : "").includes(
        searchText.toLowerCase()
      )
  );

  const currentData = filteredData;

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

  const getStatusBg = (status: string) => {
    switch (status) {
      case "approved":
        return "#E8F5E9";
      case "pending":
        return "#FFF3E0";
      case "rejected":
        return "#FFEBEE";
      default:
        return "#FFF3E0";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>All Buddis</Text>
          <Text style={styles.subtitle}>
            {currentData.length} buddis • Page {currentPage} of {totalPages}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={18}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search buddis by name or email..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={18} color="#666" />
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
            <View style={styles.emailColumn}>
              <Text style={styles.headerText}>Email</Text>
            </View>
            <View style={styles.areaColumn}>
              <Text style={styles.headerText}>Area of Study</Text>
            </View>
            <View style={styles.schoolColumn}>
              <Text style={styles.headerText}>Current School</Text>
            </View>
            <View style={styles.statusColumn}>
              <Text style={styles.headerText}>Status</Text>
            </View>
            <View style={styles.actionsColumn}>
              <Text style={styles.headerText}>Actions</Text>
            </View>
          </View>

          {/* Table Rows */}
          {currentData.map((item, index) => (
            <View
              key={item.id}
              style={[styles.tableRow, index % 2 === 0 && styles.evenRow]}
            >
              <View style={styles.nameColumn}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.name
                        ? item.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{item.name}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.emailColumn}>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {item.email}
                </Text>
              </View>
              <View style={styles.areaColumn}>
                <Text style={styles.userEmail}>{item.areaOfStudy}</Text>
              </View>
              <View style={styles.schoolColumn}>
                <Text style={styles.userEmail}>{item.currentSchool}</Text>
              </View>
              <View style={styles.statusColumn}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBg(item.status) },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(item.status) },
                    ]}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.actionsColumn}>
                <TouchableOpacity
                  onPress={() => onActionClick && onActionClick(item)}
                  style={styles.viewButton}
                  accessibilityLabel="View buddi details"
                >
                  <Ionicons name="eye" size={16} color="#fff" />
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
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
          onPress={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={currentPage === 1 ? "#ccc" : "#FF932E"}
          />
          <Text
            style={[styles.pageText, currentPage === 1 && styles.disabledText]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.pageNumbers}>
          {(() => {
            const pages = [];
            const maxVisible = 5;

            if (totalPages <= maxVisible) {
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
              }
            } else {
              if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                  pages.push(i);
                }
                pages.push("ellipsis");
                pages.push(totalPages);
              } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("ellipsis");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                pages.push(1);
                pages.push("ellipsis");
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("ellipsis");
                pages.push(totalPages);
              }
            }

            return pages.map((page, index) => {
              if (page === "ellipsis") {
                return (
                  <Text key={`ellipsis-${index}`} style={styles.ellipsis}>
                    ...
                  </Text>
                );
              }
              const pageNumber = page as number;
              return (
                <TouchableOpacity
                  key={pageNumber}
                  style={[
                    styles.pageNumber,
                    currentPage === pageNumber && styles.activePage,
                  ]}
                  onPress={() => onPageChange(pageNumber)}
                >
                  <Text
                    style={[
                      styles.pageNumberText,
                      currentPage === pageNumber && styles.activePageText,
                    ]}
                  >
                    {pageNumber}
                  </Text>
                </TouchableOpacity>
              );
            });
          })()}
        </View>

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
          onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
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
            color={currentPage === totalPages ? "#ccc" : "#FF932E"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: "#1a1a1a",
    fontFamily: "Comfortaa-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    fontFamily: "Comfortaa-Regular",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  filterText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  tableContainer: {
    marginBottom: 24,
  },
  table: {
    minWidth: 900,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 16,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
    alignItems: "center",
  },
  evenRow: {
    backgroundColor: "#fafbfc",
  },
  nameColumn: {
    width: 300,
  },
  emailColumn: {
    width: 220,
  },
  areaColumn: {
    width: 200,
  },
  schoolColumn: {
    width: 200,
  },
  statusColumn: {
    width: 140,
    alignItems: "center",
  },
  actionsColumn: {
    width: 120,
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    fontFamily: "Comfortaa-Bold",
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
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
    fontWeight: "600",
    color: "#1a1a1a",
    fontFamily: "Comfortaa-Bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Comfortaa-Bold",
    textTransform: "uppercase" as any,
    letterSpacing: 0.5,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF932E",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    shadowColor: "#FF932E",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewButtonText: {
    fontSize: 13,
    color: "#fff",
    fontFamily: "Comfortaa-Bold",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  pageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: "#f5f5f5",
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
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  activePage: {
    backgroundColor: "#FF932E",
    borderColor: "#FF932E",
  },
  pageNumberText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
    fontWeight: "500",
  },
  activePageText: {
    color: "#fff",
    fontWeight: "600",
  },
  ellipsis: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
    paddingHorizontal: 8,
  },
});

export default BuddisTable;
