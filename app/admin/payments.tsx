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

// Mock data for Payments
const paymentsList = [
  {
    id: "1",
    parentName: "Sarah Johnson",
    parentImage: "https://randomuser.me/api/portraits/women/1.jpg",
    buddiName: "John Smith",
    buddiImage: "https://randomuser.me/api/portraits/men/1.jpg",
    amount: 125.5,
    date: "2024-01-15",
    status: "Completed",
    paymentMethod: "Credit Card",
    lastFour: "4532",
    childName: "Emma Johnson",
    pickupCount: 5,
    reference: "TXN001234",
  },
  {
    id: "2",
    parentName: "Michael Brown",
    parentImage: "https://randomuser.me/api/portraits/men/2.jpg",
    buddiName: "Emma Davis",
    buddiImage: "https://randomuser.me/api/portraits/women/2.jpg",
    amount: 89.75,
    date: "2024-01-14",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    lastFour: "8901",
    childName: "Olivia Brown",
    pickupCount: 3,
    reference: "TXN001235",
  },
  {
    id: "3",
    parentName: "Jennifer Davis",
    parentImage: "https://randomuser.me/api/portraits/women/3.jpg",
    buddiName: "David Wilson",
    buddiImage: "https://randomuser.me/api/portraits/men/3.jpg",
    amount: 200.0,
    date: "2024-01-13",
    status: "Failed",
    paymentMethod: "Credit Card",
    lastFour: "1234",
    childName: "Liam Davis",
    pickupCount: 8,
    reference: "TXN001236",
  },
];

const PaymentCard = ({ payment, onViewDetails, onProcessRefund }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return { bg: "#D1FAE5", text: "#10B981" };
      case "Pending":
        return { bg: "#FEF3C7", text: "#F59E0B" };
      case "Failed":
        return { bg: "#FEE2E2", text: "#EF4444" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  const statusColors = getStatusColor(payment.status);

  return (
    <View className="bg-white rounded-xl p-4 mx-4 mb-4 border border-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Text className="font-comfortaa-bold text-lg text-black">
            ${payment.amount.toFixed(2)}
          </Text>
          <View
            className="ml-3 px-3 py-1 rounded-full"
            style={{ backgroundColor: statusColors.bg }}
          >
            <Text
              className="font-comfortaa-bold text-xs"
              style={{ color: statusColors.text }}
            >
              {payment.status}
            </Text>
          </View>
        </View>
        <Text className="font-comfortaa text-[#71727A] text-sm">
          {payment.reference}
        </Text>
      </View>

      {/* Parent & Buddi */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: payment.parentImage }}
            className="w-10 h-10 rounded-full mr-2"
          />
          <View>
            <Text className="font-comfortaa-bold text-sm text-black">
              {payment.parentName}
            </Text>
            <Text className="font-comfortaa text-xs text-[#71727A]">
              Parent
            </Text>
          </View>
        </View>
        <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
        <View className="flex-row items-center flex-1 justify-end">
          <View className="items-end mr-2">
            <Text className="font-comfortaa-bold text-sm text-black">
              {payment.buddiName}
            </Text>
            <Text className="font-comfortaa text-xs text-[#71727A]">Buddi</Text>
          </View>
          <Image
            source={{ uri: payment.buddiImage }}
            className="w-10 h-10 rounded-full"
          />
        </View>
      </View>

      {/* Payment Details */}
      <View className="bg-gray-50 rounded-lg p-3 mb-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-comfortaa text-xs text-[#71727A]">Child</Text>
          <Text className="font-comfortaa-bold text-sm text-[#71727A]">
            {payment.childName}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-comfortaa text-xs text-[#71727A]">Pickups</Text>
          <Text className="font-comfortaa-bold text-sm text-[#71727A]">
            {payment.pickupCount} trips
          </Text>
        </View>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-comfortaa text-xs text-[#71727A]">Date</Text>
          <Text className="font-comfortaa-bold text-sm text-[#71727A]">
            {new Date(payment.date).toLocaleDateString()}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-comfortaa text-xs text-[#71727A]">
            Payment Method
          </Text>
          <Text className="font-comfortaa-bold text-sm text-[#71727A]">
            {payment.paymentMethod} ****{payment.lastFour}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={onViewDetails}
          className="flex-1 bg-gray-100 rounded-lg py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="eye-outline" size={16} color="#4B5563" />
          <Text className="font-comfortaa text-[#71727A] ml-2 text-sm">
            View Details
          </Text>
        </TouchableOpacity>
        {payment.status === "Completed" && (
          <TouchableOpacity
            onPress={onProcessRefund}
            className="flex-1 bg-red-50 rounded-lg py-2 px-3 flex-row items-center justify-center"
          >
            <Ionicons
              name="return-down-back-outline"
              size={16}
              color="#EF4444"
            />
            <Text className="font-comfortaa text-red-500 ml-2 text-sm">
              Refund
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" },
  ];

  const filteredPayments = paymentsList.filter((payment) => {
    const matchesSearch =
      payment.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.buddiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && payment.status.toLowerCase() === selectedFilter;
  });

  const totalAmount = paymentsList.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const completedAmount = paymentsList
    .filter((p) => p.status === "Completed")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = paymentsList
    .filter((p) => p.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

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
          <PageHeader title="Payment Management" />
        </View>

        {/* Stats Cards */}
        <View className="flex-row justify-between px-4 mb-6">
          <View className="bg-white rounded-xl p-4 flex-1 mr-2 border border-gray-100">
            <View className="flex-row items-center mb-2">
              <MaterialIcons
                name="account-balance-wallet"
                size={24}
                color="#10B981"
              />
              <Text className="ml-2 font-comfortaa-bold text-lg">
                ${completedAmount.toFixed(0)}
              </Text>
            </View>
            <Text className="font-comfortaa text-[#71727A] text-sm">
              Completed
            </Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 mx-1 border border-gray-100">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="pending-actions" size={24} color="#F59E0B" />
              <Text className="ml-2 font-comfortaa-bold text-lg">
                ${pendingAmount.toFixed(0)}
              </Text>
            </View>
            <Text className="font-comfortaa text-[#71727A] text-sm">
              Pending
            </Text>
          </View>
          <View className="bg-white rounded-xl p-4 flex-1 ml-2 border border-gray-100">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="payments" size={24} color="#3B82F6" />
              <Text className="ml-2 font-comfortaa-bold text-lg">
                ${totalAmount.toFixed(0)}
              </Text>
            </View>
            <Text className="font-comfortaa text-[#71727A] text-sm">
              Total Volume
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="mx-4 mb-4">
          <View className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search by parent, buddi, or reference..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 font-comfortaa text-[#71727A]"
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
                    : "text-[#71727A]"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Payments List */}
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onViewDetails={() =>
                console.log("View details for:", payment.reference)
              }
              onProcessRefund={() =>
                console.log("Process refund for:", payment.reference)
              }
            />
          ))
        ) : (
          <View className="bg-white rounded-xl p-8 mx-4 items-center">
            <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
            <Text className="font-comfortaa-bold text-lg text-[#71727A] mt-4">
              No Payments Found
            </Text>
            <Text className="font-comfortaa text-[#71727A] text-center mt-2">
              Try adjusting your search or filter criteria
            </Text>
          </View>
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
