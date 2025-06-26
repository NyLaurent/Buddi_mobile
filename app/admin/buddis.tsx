import AdminBuddiApplicationCard from "@/components/admin/AdminBuddiApplicationCard";
import PageHeader from "@/components/commons/PageHeader";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for Buddi applications
const buddiApplications = [
  {
    id: "1",
    buddi: {
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      name: "John Smith",
      gender: "M",
      email: "john.smith@email.com",
      age: "19",
      phone: "+1 234 567 8901",
      school: "Lincoln High School",
      schoolName: "Lincoln High",
    },
    reference: {
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      name: "Sarah Johnson",
      phone: "+1 234 567 8902",
      role: "Head Teacher",
    },
    status: "Pending Review",
    approved: false,
  },
  {
    id: "2",
    buddi: {
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      name: "Emma Davis",
      gender: "F",
      email: "emma.davis@email.com",
      age: "20",
      phone: "+1 234 567 8903",
      school: "Oak Elementary",
      schoolName: "Oak Elementary",
    },
    reference: {
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      name: "Michael Brown",
      phone: "+1 234 567 8904",
      role: "Principal",
    },
    status: "Interview Scheduled",
    approved: false,
  },
  {
    id: "3",
    buddi: {
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      name: "David Wilson",
      gender: "M",
      email: "david.wilson@email.com",
      age: "18",
      phone: "+1 234 567 8905",
      school: "St. Mary's School",
      schoolName: "St. Mary's",
    },
    reference: {
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      name: "Jennifer Taylor",
      phone: "+1 234 567 8906",
      role: "Head Teacher",
    },
    status: "Approved",
    approved: true,
  },
];

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Interview", value: "interview" },
];

export default function AdminBuddisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [applications, setApplications] = useState(buddiApplications);

  const handleApprove = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              approved: !app.approved,
              status: app.approved ? "Pending Review" : "Approved",
            }
          : app
      )
    );
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.buddi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.buddi.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "pending")
      return matchesSearch && app.status === "Pending Review";
    if (selectedFilter === "approved") return matchesSearch && app.approved;
    if (selectedFilter === "interview")
      return matchesSearch && app.status === "Interview Scheduled";

    return matchesSearch;
  });

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

        {/* Stats Cards */}
        <View className="flex-row justify-between px-4 mb-6">
          <View className="bg-white rounded-xl p-4 flex-1 mr-2 border border-gray-100">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="people" size={24} color="#3B82F6" />
              <Text className="ml-2 font-comfortaa-bold text-lg">42</Text>
            </View>
            <Text className="font-comfortaa text-gray-500 text-sm">
              Total Buddis
            </Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 mx-1 border border-gray-100">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="pending" size={24} color="#F59E0B" />
              <Text className="ml-2 font-comfortaa-bold text-lg">8</Text>
            </View>
            <Text className="font-comfortaa text-gray-500 text-sm">
              Pending
            </Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 ml-2 border border-gray-100">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="check-circle" size={24} color="#10B981" />
              <Text className="ml-2 font-comfortaa-bold text-lg">34</Text>
            </View>
            <Text className="font-comfortaa text-gray-500 text-sm">Active</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="mx-4 mb-4">
          <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search Buddis by name or email..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 font-comfortaa text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 20 }}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => setSelectedFilter(filter.value)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedFilter === filter.value ? "bg-primary" : "bg-gray-100"
              }`}
            >
              <Text
                className={`font-comfortaa ${
                  selectedFilter === filter.value
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Applications List */}
        <View className="px-2">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <AdminBuddiApplicationCard
                key={application.id}
                buddi={application.buddi}
                reference={application.reference}
                status={application.status}
                approved={application.approved}
                onViewDetails={() => {
                  // Navigate to details page
                  console.log("View details for:", application.buddi.name);
                }}
                onApprove={() => handleApprove(application.id)}
              />
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 mx-4 items-center">
              <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
              <Text className="font-comfortaa-bold text-lg text-gray-600 mt-4">
                No Buddis Found
              </Text>
              <Text className="font-comfortaa text-gray-500 text-center mt-2">
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
});
