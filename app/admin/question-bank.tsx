import QuestionBankComponent from "@/components/admin/QuestionBankComponent";
import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
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
          <PageHeader title="Question Bank Management" />
        </View>

        {/* Analytics Card */}
        <View style={styles.analyticsContainer}>
          <AnalyticsCard
            icon={<Ionicons name="help-circle" size={36} color="#9C27B0" />}
            title="Total Questions"
            value="24"
            subtitle="Active questions"
          />
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
  analyticsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  content: {
    paddingHorizontal: 16,
    flex: 1,
  },
});
