import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface TransactionCardProps {
  type: "credit" | "debit";
  amount: string;
  date: string;
  description: string;
  status: "completed" | "pending" | "failed";
}

const TransactionCard = ({
  type,
  amount,
  date,
  description,
  status,
}: TransactionCardProps) => {
  const statusColor = {
    completed: "#22C55E",
    pending: "#F59E0B",
    failed: "#EF4444",
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-3">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
              type === "credit" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <Ionicons
              name={type === "credit" ? "arrow-down" : "arrow-up"}
              size={20}
              color={type === "credit" ? "#22C55E" : "#EF4444"}
            />
          </View>
          <View>
            <Text className="font-comfortaa-bold">{description}</Text>
            <Text className="text-sm text-gray-500">{date}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text
            className={`font-comfortaa-bold ${
              type === "credit" ? "text-green-600" : "text-red-600"
            }`}
          >
            {type === "credit" ? "+" : "-"}${amount}
          </Text>
          <Text className="text-sm" style={{ color: statusColor[status] }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function PaymentsScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Balance Card */}
        <View className="bg-primary rounded-2xl p-6 mb-6">
          <Text className="text-white text-lg font-comfortaa">
            Available Balance
          </Text>
          <Text className="text-white text-3xl font-comfortaa-bold mt-2">
            $2,500.00
          </Text>
          <View className="flex-row mt-6">
            <TouchableOpacity className="bg-white px-6 py-3 rounded-xl mr-3">
              <Text className="text-primary font-comfortaa-bold">
                Add Money
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white/20 px-6 py-3 rounded-xl">
              <Text className="text-white font-comfortaa-bold">Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-1">
              <MaterialIcons name="payment" size={24} color="#FF9100" />
            </View>
            <Text className="text-sm font-comfortaa">Payments</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-1">
              <MaterialIcons name="history" size={24} color="#FF9100" />
            </View>
            <Text className="text-sm font-comfortaa">History</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-1">
              <MaterialIcons name="receipt" size={24} color="#FF9100" />
            </View>
            <Text className="text-sm font-comfortaa">Invoices</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-1">
              <MaterialIcons name="settings" size={24} color="#FF9100" />
            </View>
            <Text className="text-sm font-comfortaa">Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-comfortaa-bold">
              Recent Transactions
            </Text>
            <TouchableOpacity>
              <Text className="text-primary font-comfortaa">View All</Text>
            </TouchableOpacity>
          </View>

          <TransactionCard
            type="debit"
            amount="50.00"
            date="Today, 2:30 PM"
            description="School Pickup - Bryan"
            status="completed"
          />

          <TransactionCard
            type="credit"
            amount="200.00"
            date="Yesterday, 10:15 AM"
            description="Wallet Top-up"
            status="completed"
          />

          <TransactionCard
            type="debit"
            amount="45.00"
            date="Mar 15, 2024"
            description="School Pickup - Emma"
            status="pending"
          />

          <TransactionCard
            type="debit"
            amount="55.00"
            date="Mar 14, 2024"
            description="School Pickup - Bryan"
            status="completed"
          />
        </View>
      </View>
    </ScrollView>
  );
}
