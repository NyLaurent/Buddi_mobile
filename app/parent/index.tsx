import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnalyticsCard from "../../components/commons/AnalyticsCard";
import Calendar from "../../components/commons/Calendar";
import KidPickupCard from "../../components/parent/KidPickupCard";
import PaymentAlert from "../../components/parent/PaymentAlert";
import { useAuth } from "../../context/AuthContext";
export default function ParentDashboard() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logout button clicked!"); // Debug log
    handleLogoutConfirmed();
  };

  const handleLogoutConfirmed = async () => {
    console.log("User confirmed logout"); // Debug log
    try {
      console.log("Calling logout function..."); // Debug log
      await logout();
      console.log("Logout successful, navigating to login..."); // Debug log
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error); // Debug log
      if (typeof window !== 'undefined') {
        window.alert("Failed to logout. Please try again.");
      }
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-white px-3"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-start px-1 pt-6">
          {/* Logo */}
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-[75px] h-[40px] mt-1"
            resizeMode="contain"
          />
          {/* Icons */}
          <View className="flex-row items-center gap-3 pr-1">
            {/* Message Icon with badge */}
            <View className="relative">
              <TouchableOpacity className="p-2 bg-orange-400 rounded-xl shadow-sm">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={22}
                  color="white"
                />
              </TouchableOpacity>
              {/* <View
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "#EF4444",
                  borderRadius: 9999,
                  width: 24,
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "white",
                  zIndex: 999,
                }}
              >
                <Text className="text-xs text-white font-bold">9</Text>
              </View> */}
            </View>
            {/* Search Icon */}
            <TouchableOpacity className="p-2 bg-orange-400 rounded-xl shadow-sm">
              <Ionicons name="search-outline" size={22} color="white" />
            </TouchableOpacity>
            {/* Notification Icon */}
            <TouchableOpacity className="p-2 bg-orange-400 rounded-xl shadow-sm">
              <Ionicons name="notifications-outline" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 bg-red-500 rounded-xl shadow-sm"
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Row with Avatar */}
        <View className="flex-row items-center justify-between mt-6 mb-2 px-1">
          <View>
            <Text className="text-2xl font-comfortaa-bold">
              Good morning, Jane
            </Text>
            <Text className="text-gray-500 font-comfortaa mt-1">
              Glad to see you again, Parent! <Text className="text-lg">😊</Text>
            </Text>
          </View>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            className="w-14 h-14 rounded-full bg-gray-100"
            resizeMode="cover"
          />
        </View>

        {/* Stats Cards */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <View className="w-[48%] mb-3">
            <AnalyticsCard
              icon={<FontAwesome5 name="car" size={28} color="#8B5CF6" />}
              title={"Today's Pickups"}
              value="12"
              subtitle="2 Schools"
            />
          </View>
          <View className="w-[48%] mb-3">
            <AnalyticsCard
              icon={
                <MaterialIcons name="access-time" size={28} color="#3B82F6" />
              }
              title="Timesheets"
              value="3"
              subtitle="All time"
            />
          </View>
          <View className="w-[48%] mb-3">
            <AnalyticsCard
              icon={<Feather name="users" size={28} color="#22C55E" />}
              title="Buddis"
              value="3"
              subtitle="Connected"
            />
          </View>
          <View className="w-[48%] mb-3">
            <AnalyticsCard
              icon={<FontAwesome5 name="child" size={28} color="#FF9100" />}
              title="Registered Kids"
              value="2"
              subtitle="2 Schools"
            />
          </View>
        </View>

        {/* Payment Alert */}
        <PaymentAlert />

        {/* Pickup Schedule */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2 px-2">
            <Text className="text-sm font-comfortaa-bold text-[#232B3A]">
              Your Kids Pickup Schedule
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm text-primary font-comfortaa mr-1">
                Full Schedule
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FF9100" />
            </TouchableOpacity>
          </View>
          <KidPickupCard
            childName="Bryan Smith"
            remaining="3,234.8 Remaining"
            schedule="5 Days a Week"
            buddiName="Brian Ford"
            buddiEmail="brianford@kdk.com"
            buddiAvatar="https://randomuser.me/api/portraits/men/2.jpg"
            buddiStatus="Available"
            schoolName="School Name"
            destination="Senen"
            mainAction="Trip Not Yet Started"
          />
        </View>

        {/* Extra Activities Calendar */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mx-4 mb-2">
            <Text className="font-comfortaa-bold text-xl">Schedule</Text>
            <TouchableOpacity>
              <Text className="text-primary font-comfortaa">View All</Text>
            </TouchableOpacity>
          </View>
          <Calendar
            selectedDate={selectedDate}
            onDaySelect={(date) => setSelectedDate(date)}
            primaryColor="#FF932E"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
