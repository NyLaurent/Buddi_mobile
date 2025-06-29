import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Question {
  id: string;
  text: string;
  type: "text" | "multiple-choice" | "yes-no";
  options?: string[];
  isRequired: boolean;
  category: "Transportation" | "Background" | "Experience" | "Availability";
  status: "Active" | "Inactive";
  estimatedTime: string;
}

const QuestionBankComponent: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "Why are you interested in becoming a Buddi?",
      type: "text",
      isRequired: true,
      category: "Transportation",
      status: "Active",
      estimatedTime: "4 Mins",
    },
    {
      id: "2",
      text: "Why are you interested in bec...",
      type: "text",
      isRequired: false,
      category: "Transportation",
      status: "Active",
      estimatedTime: "3 Mins",
    },
    {
      id: "3",
      text: "Why are you interested in bec...",
      type: "text",
      isRequired: false,
      category: "Transportation",
      status: "Active",
      estimatedTime: "3 Mins",
    },
    {
      id: "4",
      text: "Why are you interested in bec...",
      type: "text",
      isRequired: false,
      category: "Transportation",
      status: "Active",
      estimatedTime: "3 Mins",
    },
    {
      id: "5",
      text: "Why are you interested in bec...",
      type: "text",
      isRequired: false,
      category: "Transportation",
      status: "Active",
      estimatedTime: "3 Mins",
    },
    {
      id: "6",
      text: "Why are you interested in bec...",
      type: "text",
      isRequired: false,
      category: "Transportation",
      status: "Active",
      estimatedTime: "3 Mins",
    },
    {
      id: "7",
      text: "Why are you interested in bec...",
      type: "text",
      isRequired: false,
      category: "Transportation",
      status: "Active",
      estimatedTime: "3 Mins",
    },
    {
      id: "8",
      text: "Why are you interested in bec...",
      type: "text",
      isRequired: false,
      category: "Transportation",
      status: "Active",
      estimatedTime: "3 Mins",
    },
  ]);

  const [expandedCard, setExpandedCard] = useState<string | null>("1");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const handleCardToggle = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

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
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pageNumbers.map((page, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.pageNumber,
          page === currentPage && styles.activePageNumber,
          page === "..." && styles.ellipsisPage,
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
          ]}
        >
          {page}
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderQuestionCard = (question: Question, index: number) => {
    const isExpanded = expandedCard === question.id;
    const questionNumber = startIndex + index + 1;

    return (
      <View key={question.id} style={styles.questionCard}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => handleCardToggle(question.id)}
        >
          <View style={styles.questionNumber}>
            <Text style={styles.numberText}>{questionNumber}</Text>
          </View>

          <View style={styles.questionInfo}>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{question.category}</Text>
              <Ionicons name="chevron-up" size={12} color="#2196F3" />
            </View>
            <Text style={styles.questionPreview} numberOfLines={1}>
              {question.text}
            </Text>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={16} color="#8A8A8A" />
          </TouchableOpacity>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.questionDetails}>
              <View style={styles.timeAndStatus}>
                <View style={styles.estimatedTime}>
                  <Ionicons name="time-outline" size={12} color="#2196F3" />
                  <Text style={styles.timeText}>{question.estimatedTime}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    question.status === "Active"
                      ? styles.activeBadge
                      : styles.inactiveBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      question.status === "Active"
                        ? styles.activeText
                        : styles.inactiveText,
                    ]}
                  >
                    {question.status}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                  <Ionicons name="arrow-forward" size={12} color="#8A8A8A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteQuestion(question.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                  <Ionicons name="trash-outline" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Questions List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.questionsList}>
          {currentQuestions.map((question, index) =>
            renderQuestionCard(question, index)
          )}
        </View>
      </ScrollView>

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
              size={14}
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
              size={14}
              color={currentPage === totalPages ? "#CCCCCC" : "#8A8A8A"}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionsList: {
    gap: 8,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  questionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF932E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  numberText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "Comfortaa-Regular",
  },
  questionInfo: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 10,
    color: "#2196F3",
    fontFamily: "Comfortaa-Regular",
    marginRight: 4,
  },
  questionPreview: {
    fontSize: 11,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  moreButton: {
    padding: 4,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  questionDetails: {
    gap: 12,
  },
  timeAndStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  estimatedTime: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  timeText: {
    fontSize: 9,
    color: "#2196F3",
    fontFamily: "Comfortaa-Regular",
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeBadge: {
    backgroundColor: "#E8F5E8",
  },
  inactiveBadge: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: 9,
    fontFamily: "Comfortaa-Regular",
  },
  activeText: {
    color: "#4CAF50",
  },
  inactiveText: {
    color: "#F44336",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingVertical: 8,
    gap: 4,
  },
  editButtonText: {
    fontSize: 11,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4444",
    borderRadius: 8,
    paddingVertical: 8,
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 11,
    color: "#fff",
    fontFamily: "Comfortaa-Regular",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 12,
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 11,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  disabledText: {
    color: "#CCCCCC",
  },
  pageNumbers: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    gap: 4,
  },
  pageNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activePageNumber: {
    backgroundColor: "#2196F3",
  },
  ellipsisPage: {
    backgroundColor: "transparent",
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
});

export default QuestionBankComponent;
