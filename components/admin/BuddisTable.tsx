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
  // Remove internal pagination state
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;

  const filteredData = data.filter(
    (item) =>
      (item.name ? item.name.toLowerCase() : "").includes(
        searchText.toLowerCase()
      ) ||
      (item.email ? item.email.toLowerCase() : "").includes(
        searchText.toLowerCase()
      )
  );

  // No slicing, show all data passed in
  // const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const currentData = filteredData;

 

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
          {currentData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.tableRow}
              activeOpacity={1}
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
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
              <View style={styles.areaColumn}>
                <Text style={styles.userEmail}>{item.areaOfStudy}</Text>
              </View>
              <View style={styles.schoolColumn}>
                <Text style={styles.userEmail}>{item.currentSchool}</Text>
              </View>
              <View style={styles.statusColumn}>
                <View
                  style={{
                    backgroundColor: "#FF9500",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 12,
                    }}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
              <View style={styles.actionsColumn}>
                <TouchableOpacity
                  onPress={() => onActionClick && onActionClick(item)}
                  style={{ alignItems: "center", justifyContent: "center" }}
                  accessibilityLabel="Show actions"
                >
                  <Ionicons
                    name="ellipsis-horizontal-circle"
                    size={28}
                    color="#FF9500"
                  />
                </TouchableOpacity>
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
          onPress={() => onPageChange(Math.max(1, currentPage - 1))}
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
          {(() => {
            const pages = [];
            const maxVisible = 5;

            if (totalPages <= maxVisible) {
              // Show all pages if total is 5 or less
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
              }
            } else {
              // Show first 3 pages, ellipsis, current page, ellipsis, last page
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
  emailColumn: {
    width: 200,
  },
  areaColumn: {
    width: 200,
  },
  schoolColumn: {
    width: 200,
  },
  statusColumn: {
    width: 150,
    alignItems: "center",
  },
  actionsColumn: {
    width: 150,
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
