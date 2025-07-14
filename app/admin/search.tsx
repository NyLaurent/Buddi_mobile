import PageHeader from "@/components/commons/PageHeader";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock search results data
const mockSearchResults = {
  buddis: [
    {
      id: "1",
      type: "buddi",
      name: "John Smith",
      email: "john.smith@email.com",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      status: "Active",
      school: "Lincoln High School",
    },
    {
      id: "2",
      type: "buddi",
      name: "Emma Davis",
      email: "emma.davis@email.com",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      status: "Pending",
      school: "Oak Elementary",
    },
  ],
  parents: [
    {
      id: "3",
      type: "parent",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      status: "Active",
      children: 2,
    },
    {
      id: "4",
      type: "parent",
      name: "Michael Brown",
      email: "michael.brown@email.com",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      status: "Active",
      children: 1,
    },
  ],
  payments: [
    {
      id: "5",
      type: "payment",
      reference: "TXN001234",
      amount: 125.5,
      parentName: "Sarah Johnson",
      buddiName: "John Smith",
      status: "Completed",
      date: "2024-01-15",
    },
  ],
};

const SearchResultCard = ({ item, onPress }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case "buddi":
        return <MaterialIcons name="person" size={20} color="#3B82F6" />;
      case "parent":
        return (
          <MaterialIcons name="family-restroom" size={20} color="#8B5CF6" />
        );
      case "payment":
        return <MaterialIcons name="payment" size={20} color="#10B981" />;
      default:
        return <MaterialIcons name="search" size={20} color="#6B7280" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return { bg: "#D1FAE5", text: "#10B981" };
      case "Pending":
        return { bg: "#FEF3C7", text: "#F59E0B" };
      case "Completed":
        return { bg: "#D1FAE5", text: "#10B981" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  const statusColors = getStatusColor(item.status);

  if (item.type === "payment") {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="bg-white rounded-xl p-4 mx-4 mb-3 border border-gray-100"
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            {getTypeIcon(item.type)}
            <Text className="font-comfortaa-bold text-sm text-black ml-2">
              Payment {item.reference}
            </Text>
          </View>
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: statusColors.bg }}
          >
            <Text
              className="font-comfortaa-bold text-xs"
              style={{ color: statusColors.text }}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <Text className="font-comfortaa text-[#71727A] text-sm mb-1">
          ${item.amount.toFixed(2)} • {item.parentName} → {item.buddiName}
        </Text>
        <Text className="font-comfortaa text-[#71727A] text-xs">
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mx-4 mb-3 border border-gray-100"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: item.image }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View className="flex-1">
            <View className="flex-row items-center">
              {getTypeIcon(item.type)}
              <Text className="font-comfortaa-bold text-sm text-black ml-2">
                {item.name}
              </Text>
            </View>
            <Text className="font-comfortaa text-[#71727A] text-xs">
              {item.email}
            </Text>
          </View>
        </View>
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: statusColors.bg }}
        >
          <Text
            className="font-comfortaa-bold text-xs"
            style={{ color: statusColors.text }}
          >
            {item.status}
          </Text>
        </View>
      </View>
      {item.type === "buddi" && (
        <Text className="font-comfortaa text-[#71727A] text-sm">
          {item.school}
        </Text>
      )}
      {item.type === "parent" && (
        <Text className="font-comfortaa text-[#71727A] text-sm">
          {item.children} child{item.children !== 1 ? "ren" : ""}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const QuickActionCard = ({
  icon,
  title,
  description,
  onPress,
  color = "#FF932E",
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white rounded-xl p-4 mx-2 mb-4 border border-gray-100 min-w-[160px]"
  >
    <View
      className="w-12 h-12 rounded-full items-center justify-center mb-3"
      style={{ backgroundColor: `${color}20` }}
    >
      {icon}
    </View>
    <Text className="font-comfortaa-bold text-sm text-black mb-1">{title}</Text>
    <Text className="font-comfortaa text-xs text-[#71727A]">{description}</Text>
  </TouchableOpacity>
);

export default function AdminSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Buddis", value: "buddi" },
    { label: "Parents", value: "parent" },
    { label: "Payments", value: "payment" },
  ];

  // Combine all search results
  const allResults = [
    ...mockSearchResults.buddis,
    ...mockSearchResults.parents,
    ...mockSearchResults.payments,
  ];

  const filteredResults = allResults.filter((item) => {
    const matchesQuery =
      searchQuery.length === 0 ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reference?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === "all" || item.type === activeFilter;

    return matchesQuery && matchesFilter;
  });

  const hasSearchQuery = searchQuery.length > 0;

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
          <PageHeader title="Global Search" />
        </View>

        {/* Search Bar */}
        <View className="mx-4 mb-6">
          <View className="bg-white rounded-xl px-4 py-4 flex-row items-center border border-gray-200 shadow-sm">
            <Ionicons name="search" size={24} color="#FF932E" />
            <TextInput
              placeholder="Search buddis, parents, payments..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 font-comfortaa text-[#71727A] text-base"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {!hasSearchQuery ? (
          <>
            {/* Quick Actions */}
            <View className="mb-6">
              <Text className="font-comfortaa-bold text-lg text-black mx-4 mb-4">
                Quick Actions
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                <QuickActionCard
                  icon={
                    <MaterialIcons
                      name="person-add"
                      size={24}
                      color="#3B82F6"
                    />
                  }
                  title="Add New Buddi"
                  description="Review applications"
                  onPress={() => console.log("Add Buddi")}
                  color="#3B82F6"
                />
                <QuickActionCard
                  icon={
                    <MaterialIcons
                      name="family-restroom"
                      size={24}
                      color="#8B5CF6"
                    />
                  }
                  title="Parent Support"
                  description="Help with issues"
                  onPress={() => console.log("Parent Support")}
                  color="#8B5CF6"
                />
                <QuickActionCard
                  icon={
                    <MaterialIcons
                      name="assessment"
                      size={24}
                      color="#10B981"
                    />
                  }
                  title="Generate Report"
                  description="Platform analytics"
                  onPress={() => console.log("Generate Report")}
                  color="#10B981"
                />
                <QuickActionCard
                  icon={
                    <MaterialIcons
                      name="support-agent"
                      size={24}
                      color="#F59E0B"
                    />
                  }
                  title="Coverage Alert"
                  description="Handle requests"
                  onPress={() => console.log("Coverage Alert")}
                  color="#F59E0B"
                />
              </ScrollView>
            </View>

            {/* Recent Activity */}
            <View className="mx-4">
              <Text className="font-comfortaa-bold text-lg text-black mb-4">
                Recent Activity
              </Text>
              <View className="bg-white rounded-xl p-4 border border-gray-100">
                <Text className="font-comfortaa text-[#71727A] text-center">
                  Start typing to search across all platform data
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Filter Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                marginBottom: 20,
              }}
            >
              {filterOptions.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  onPress={() => setActiveFilter(filter.value)}
                  className={`mr-3 px-4 py-2 rounded-full ${
                    activeFilter === filter.value ? "bg-primary" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-comfortaa ${
                      activeFilter === filter.value
                        ? "text-white"
                        : "text-[#71727A]"
                    }`}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Search Results */}
            <View className="mb-4">
              <Text className="font-comfortaa-bold text-lg text-black mx-4 mb-4">
                Search Results ({filteredResults.length})
              </Text>
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <SearchResultCard
                    key={`${item.type}-${item.id}`}
                    item={item}
                    onPress={() => console.log("View", item.type, item.id)}
                  />
                ))
              ) : (
                <View className="bg-white rounded-xl p-8 mx-4 items-center">
                  <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
                  <Text className="font-comfortaa-bold text-lg text-[#71727A] mt-4">
                    No Results Found
                  </Text>
                  <Text className="font-comfortaa text-[#71727A] text-center mt-2">
                    Try different keywords or filters
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
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
