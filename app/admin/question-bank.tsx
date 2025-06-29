import QuestionBankComponent from "@/components/admin/QuestionBankComponent";
import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuestionBankPage() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        {/* Header */}
        <View className="pt-6">
          <PageHeader title="Buddi Question Bank" />
        </View>

        {/* Analytics Card and Add Button Row */}
        <View style={styles.topRow}>
          <View style={styles.analyticsCard}>
            <AnalyticsCard
              icon={<Ionicons name="flash" size={24} color="#2196F3" />}
              title="Total Questions"
              value="12"
              subtitle=""
            />
          </View>
          <View style={styles.buttonColumn}>
            <TouchableOpacity style={styles.addQuestionButton}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addButtonText}>Add Question</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.newQuestionBankButton}>
              <Text style={styles.newQuestionBankText}>new Question Bank</Text>
              <Ionicons name="document-outline" size={14} color="#8A8A8A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Question Bank Header */}
        <View style={styles.questionBankHeader}>
          <Text style={styles.questionBankTitle}>Question Bank</Text>
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

        {/* Question Bank Component */}
        <View style={styles.content}>
          <QuestionBankComponent />
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
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    gap: 12,
  },
  analyticsCard: {
    flex: 1,
  },
  buttonColumn: {
    alignItems: "center",
  },
  addQuestionButton: {
    backgroundColor: "#FF932E",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Comfortaa-Regular",
  },
  newQuestionBankButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  newQuestionBankText: {
    color: "#8A8A8A",
    fontSize: 12,
    fontFamily: "Comfortaa-Regular",
  },
  questionBankHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  questionBankTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
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
    gap: 6,
  },
  filterText: {
    color: "#8A8A8A",
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
  },
  content: {
    paddingHorizontal: 16,
    flex: 1,
  },
});
