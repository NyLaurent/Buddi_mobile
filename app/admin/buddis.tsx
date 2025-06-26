import AdminBuddiApplicationsContainer from "@/components/admin/AdminBuddiApplicationCard";
import BuddisTable from "@/components/admin/BuddisTable";
import CoverageAlertCard from "@/components/admin/CoverageAlertCard";
import FeedbackReportsContainer from "@/components/admin/FeedbackReportsCard";
import AnalyticsCard from "@/components/commons/AnalyticsCard";
import PageHeader from "@/components/commons/PageHeader";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const tabs = [
  { id: "all", label: "All Buddis" },
  { id: "approvals", label: "Registration Approvals" },
  { id: "feedback", label: "Feedback" },
  { id: "videos", label: "Profile Videos & Interviews" },
];

export default function AdminBuddisPage() {
  const [activeTab, setActiveTab] = useState("all");

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
        return (
          <View>
            {/* Analytics Cards */}
            <View style={styles.analyticsGrid}>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={<Ionicons name="flash" size={36} color="#00BCD4" />}
                  title="Total Buddis"
                  value="12"
                  subtitle="2 Schools"
                />
              </View>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={
                    <MaterialIcons name="pending" size={36} color="#9C27B0" />
                  }
                  title="Pending Approvals"
                  value="3"
                  subtitle="All time"
                />
              </View>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={
                    <MaterialIcons
                      name="support-agent"
                      size={36}
                      color="#E91E63"
                    />
                  }
                  title="Coverage Requests"
                  value="3"
                  subtitle="Connected"
                />
              </View>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={
                    <MaterialIcons
                      name="report-problem"
                      size={36}
                      color="#9C27B0"
                    />
                  }
                  title="Reported Issues"
                  value="2"
                  subtitle="2 Schools"
                />
              </View>
            </View>

            {/* Coverage Alert Section */}
            <View>
              <CoverageAlertCard
                title="21 Buddis Need Coverage For Today"
                subtitle="Review this before effects!"
                description="Please review Buddis requesting coverage to ensure availability and reliability."
                primaryButton={{
                  label: "Handle Coverages",
                  icon: <Ionicons name="hammer" size={18} color="#fff" />,
                  onPress: () => {
                    // Handle coverage logic
                    console.log("Handle coverages pressed");
                  },
                }}
              />
            </View>

            {/* Buddis Table Section */}
            <BuddisTable
              data={[
                {
                  id: "1",
                  name: "John Doe",
                  email: "johndoe@gmail.com",
                  totalJobs: 23,
                  currentStatus: "Unemployed",
                  rating: 4,
                },
                {
                  id: "2",
                  name: "John Doe",
                  email: "johndoe@gmail.com",
                  totalJobs: 2,
                  currentStatus: "Unemployed",
                  rating: 4,
                },
                {
                  id: "3",
                  name: "John Doe",
                  email: "johndoe@gmail.com",
                  totalJobs: 2,
                  currentStatus: "Unemployed",
                  rating: 4,
                },
                {
                  id: "4",
                  name: "John Doe",
                  email: "johndoe@gmail.com",
                  totalJobs: 2,
                  currentStatus: "Unemployed",
                  rating: 4,
                },
                {
                  id: "5",
                  name: "John Doe",
                  email: "johndoe@gmail.com",
                  totalJobs: 2,
                  currentStatus: "Unemployed",
                  rating: 4,
                },
              ]}
            />
          </View>
        );
      case "approvals":
        return (
          <View>
            {/* Analytics Cards Row */}
            <View style={styles.analyticsRow}>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={<Ionicons name="flash" size={36} color="#00BCD4" />}
                  title="Total Buddis"
                  value="12"
                  subtitle="2 Schools"
                />
              </View>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={
                    <MaterialIcons name="pending" size={36} color="#9C27B0" />
                  }
                  title="Pending Approvals"
                  value="3"
                  subtitle="All time"
                />
              </View>
            </View>

            {/* Coverage Alert Section */}
            <View>
              <CoverageAlertCard
                title="Customize Buddi Screening Questions"
                subtitle="Create and manage the questions Buddis must answer during onboarding. Tailor your vetting process to fit your program's standards and ensure quality matches."
                description=""
                primaryButton={{
                  label: "Manage Questions Bank",
                  icon: (
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  ),
                  onPress: () => {
                    // Handle manage questions logic
                    console.log("Manage questions pressed");
                  },
                }}
              />
            </View>

            {/* Buddi Applications Container with Pagination */}
            <AdminBuddiApplicationsContainer />
          </View>
        );
      case "feedback":
        return (
          <View>
            {/* Analytics Cards Row */}
            <View style={styles.analyticsRow}>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={<Ionicons name="thumbs-up" size={36} color="#4CAF50" />}
                  title="Pending Approvals"
                  value="12"
                  subtitle="Pending"
                />
              </View>
              <View style={styles.cardContainer}>
                <AnalyticsCard
                  icon={<Ionicons name="eye" size={36} color="#2196F3" />}
                  title="Reviewed"
                  value="12"
                  subtitle="Pending"
                />
              </View>
            </View>

            {/* Coverage Alert Section */}
            <View>
              <CoverageAlertCard
                title="21 Buddis Need Coverage For Today"
                subtitle="Review this before effects!"
                description="Please review Buddis requesting coverage to ensure availability and reliability."
                primaryButton={{
                  label: "Handle Coverages",
                  icon: <Ionicons name="hammer" size={18} color="#fff" />,
                  onPress: () => {
                    // Handle coverage logic
                    console.log("Handle coverages pressed");
                  },
                }}
              />
            </View>

            {/* Feedback Reports Container */}
            <FeedbackReportsContainer />
          </View>
        );
      case "videos":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.contentText}>
              Profile Videos & Interviews Content
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

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
          <PageHeader title="Buddi Management" />
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <View style={styles.tabGrid}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        <View style={styles.content}>{renderTabContent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  tabGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  tab: {
    width: "48%",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  activeTab: {
    backgroundColor: "#fff",
    borderColor: "#E8E8E8",
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
    textAlign: "center",
  },
  activeTabText: {
    color: "#23272F",
    fontWeight: "900",
  },
  content: {
    paddingHorizontal: 16,
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  cardContainer: {
    width: "48%",
    marginBottom: 12,
  },
  tabContent: {
    padding: 20,
    alignItems: "center",
  },
  contentText: {
    fontSize: 16,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  analyticsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
