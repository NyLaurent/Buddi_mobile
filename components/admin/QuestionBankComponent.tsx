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

interface Question {
  id: string;
  text: string;
  type: "text" | "multiple-choice" | "yes-no";
  options?: string[];
  isRequired: boolean;
  category: "background" | "experience" | "availability" | "references";
}

const QuestionBankComponent: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "Tell us about your previous experience working with children",
      type: "text",
      isRequired: true,
      category: "experience",
    },
    {
      id: "2",
      text: "Are you available for evening pickup sessions?",
      type: "yes-no",
      isRequired: true,
      category: "availability",
    },
    {
      id: "3",
      text: "What is your highest level of education?",
      type: "multiple-choice",
      options: ["High School", "Bachelor's Degree", "Master's Degree", "Other"],
      isRequired: false,
      category: "background",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: "",
    type: "text",
    isRequired: false,
    category: "background",
  });

  const handleAddQuestion = () => {
    if (newQuestion.text && newQuestion.type && newQuestion.category) {
      const question: Question = {
        id: Date.now().toString(),
        text: newQuestion.text,
        type: newQuestion.type as Question["type"],
        isRequired: newQuestion.isRequired || false,
        category: newQuestion.category as Question["category"],
        options:
          newQuestion.type === "multiple-choice"
            ? newQuestion.options
            : undefined,
      };

      setQuestions([...questions, question]);
      setNewQuestion({
        text: "",
        type: "text",
        isRequired: false,
        category: "background",
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion(question);
    setShowAddForm(true);
  };

  const handleUpdateQuestion = () => {
    if (editingQuestion && newQuestion.text) {
      const updatedQuestions = questions.map((q) =>
        q.id === editingQuestion.id ? ({ ...q, ...newQuestion } as Question) : q
      );
      setQuestions(updatedQuestions);
      setEditingQuestion(null);
      setNewQuestion({
        text: "",
        type: "text",
        isRequired: false,
        category: "background",
      });
      setShowAddForm(false);
    }
  };

  const getCategoryIcon = (category: Question["category"]) => {
    switch (category) {
      case "background":
        return "person-outline";
      case "experience":
        return "briefcase-outline";
      case "availability":
        return "time-outline";
      case "references":
        return "people-outline";
      default:
        return "help-outline";
    }
  };

  const getCategoryColor = (category: Question["category"]) => {
    switch (category) {
      case "background":
        return "#2196F3";
      case "experience":
        return "#4CAF50";
      case "availability":
        return "#FF9800";
      case "references":
        return "#9C27B0";
      default:
        return "#8A8A8A";
    }
  };

  const renderQuestionCard = (question: Question) => (
    <View key={question.id} style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View style={styles.categoryBadge}>
          <Ionicons
            name={getCategoryIcon(question.category)}
            size={16}
            color={getCategoryColor(question.category)}
          />
          <Text
            style={[
              styles.categoryText,
              { color: getCategoryColor(question.category) },
            ]}
          >
            {question.category.charAt(0).toUpperCase() +
              question.category.slice(1)}
          </Text>
        </View>
        <View style={styles.questionActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditQuestion(question)}
          >
            <Ionicons name="pencil" size={16} color="#8A8A8A" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteQuestion(question.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#FF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.questionText}>{question.text}</Text>

      <View style={styles.questionMeta}>
        <View style={styles.questionType}>
          <Text style={styles.typeText}>
            {question.type.replace("-", " ").toUpperCase()}
          </Text>
        </View>
        {question.isRequired && (
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>Required</Text>
          </View>
        )}
      </View>

      {question.options && (
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsLabel}>Options:</Text>
          {question.options.map((option, index) => (
            <Text key={index} style={styles.optionText}>
              • {option}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  const renderAddForm = () => (
    <View style={styles.addForm}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>
          {editingQuestion ? "Edit Question" : "Add New Question"}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setShowAddForm(false);
            setEditingQuestion(null);
            setNewQuestion({
              text: "",
              type: "text",
              isRequired: false,
              category: "background",
            });
          }}
        >
          <Ionicons name="close" size={20} color="#8A8A8A" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="Enter your question..."
        value={newQuestion.text}
        onChangeText={(text) => setNewQuestion({ ...newQuestion, text })}
        multiline
      />

      <View style={styles.formRow}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Type</Text>
          <View style={styles.typeSelector}>
            {(["text", "multiple-choice", "yes-no"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  newQuestion.type === type && styles.typeOptionActive,
                ]}
                onPress={() => setNewQuestion({ ...newQuestion, type })}
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    newQuestion.type === type && styles.typeOptionTextActive,
                  ]}
                >
                  {type.replace("-", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.typeSelector}>
            {(
              [
                "background",
                "experience",
                "availability",
                "references",
              ] as const
            ).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryOption,
                  newQuestion.category === category &&
                    styles.categoryOptionActive,
                ]}
                onPress={() => setNewQuestion({ ...newQuestion, category })}
              >
                <Text
                  style={[
                    styles.categoryOptionText,
                    newQuestion.category === category &&
                      styles.categoryOptionTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.requiredToggle}
        onPress={() =>
          setNewQuestion({
            ...newQuestion,
            isRequired: !newQuestion.isRequired,
          })
        }
      >
        <View
          style={[
            styles.checkbox,
            newQuestion.isRequired && styles.checkboxActive,
          ]}
        >
          {newQuestion.isRequired && (
            <Ionicons name="checkmark" size={12} color="#fff" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>Mark as required</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
      >
        <Text style={styles.submitButtonText}>
          {editingQuestion ? "Update Question" : "Add Question"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Add Button */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Screening Questions</Text>
          <Text style={styles.subtitle}>
            Manage questions for buddi applications
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Question</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Add Form */}
        {showAddForm && renderAddForm()}

        {/* Questions List */}
        <View style={styles.questionsList}>
          {questions.map(renderQuestionCard)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  subtitle: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF932E",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  questionsList: {
    gap: 16,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  questionActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  questionText: {
    fontSize: 16,
    color: "#23272F",
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: "Comfortaa-Regular",
  },
  questionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  questionType: {
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeText: {
    fontSize: 10,
    color: "#8A8A8A",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  requiredBadge: {
    backgroundColor: "#FF4444",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  requiredText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  optionsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  optionsLabel: {
    fontSize: 12,
    color: "#8A8A8A",
    fontWeight: "500",
    marginBottom: 8,
    fontFamily: "Comfortaa-Regular",
  },
  optionText: {
    fontSize: 14,
    color: "#23272F",
    marginBottom: 4,
    fontFamily: "Comfortaa-Regular",
  },
  addForm: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  closeButton: {
    padding: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#23272F",
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: "top",
    fontFamily: "Comfortaa-Regular",
  },
  formRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  formField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#23272F",
    marginBottom: 8,
    fontFamily: "Comfortaa-Regular",
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeOption: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  typeOptionActive: {
    backgroundColor: "#FF932E",
    borderColor: "#FF932E",
  },
  typeOptionText: {
    fontSize: 12,
    color: "#8A8A8A",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  typeOptionTextActive: {
    color: "#fff",
  },
  categoryOption: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginBottom: 4,
  },
  categoryOptionActive: {
    backgroundColor: "#FF932E",
    borderColor: "#FF932E",
  },
  categoryOptionText: {
    fontSize: 10,
    color: "#8A8A8A",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  categoryOptionTextActive: {
    color: "#fff",
  },
  requiredToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#FF932E",
    borderColor: "#FF932E",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  submitButton: {
    backgroundColor: "#FF932E",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
});

export default QuestionBankComponent;
