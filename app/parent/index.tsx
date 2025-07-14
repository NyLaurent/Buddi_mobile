import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
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
import ParentService, {
  ParentPickupRequest,
} from "../../services/api/parent.service";

export default function ParentDashboard() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const { user, logout, parentDetails } = useAuth();
  const router = useRouter();

  // New state for pickup requests
  const [pickupRequests, setPickupRequests] = React.useState<
    ParentPickupRequest[]
  >([]);
  const [loadingRequests, setLoadingRequests] = React.useState(true);
  const [errorRequests, setErrorRequests] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPickupRequests = async () => {
      if (!parentDetails?.id) return;
      setLoadingRequests(true);
      setErrorRequests(null);
      try {
        const res = await ParentService.getMyPickupRequests(
          parentDetails.id.toString()
        );
        setPickupRequests(res.data || []);
      } catch (err: any) {
        setErrorRequests(err.message || "Failed to fetch pickup requests.");
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchPickupRequests();
  }, [parentDetails?.id]);

  const handleLogout = () => {
    console.log("Logout button clicked!"); // Debug log
    // Show confirmation modal before logout
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: handleLogoutConfirmed },
    ]);
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
      if (typeof window !== "undefined") {
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
        <View className="flex-row justify-between items-start px-1 pt-12">
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
              <TouchableOpacity
                className="p-2 bg-orange-400 rounded-xl shadow-sm"
                onPress={() => router.push("/parent/messages")}
              >
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
              Good morning, {user?.firstName || "Parent"}
            </Text>
            <Text className="text-[#71727A] font-comfortaa mt-1">
              Glad to see you again,{" "}
              {user?.role === "parent" ? "Parent" : user?.role}!{" "}
              <Text className="text-lg">😊</Text>
            </Text>
          </View>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            className="w-14 h-14 rounded-full bg-gray-100"
            resizeMode="cover"
          />
        </View>
        {/* Call to Action Rectangle or Pickup Request Card */}
        {loadingRequests ? (
          <View style={{ marginTop: 18, marginBottom: 10 }}>
            <Text>Loading your calls...</Text>
          </View>
        ) : errorRequests ? (
          <View style={{ marginTop: 18, marginBottom: 10 }}>
            <Text style={{ color: "red" }}>{errorRequests}</Text>
          </View>
        ) : pickupRequests.length === 0 ? (
          // Show CTA if no calls
          <View
            style={{
              borderRadius: 18,
              marginTop: 18,
              marginBottom: 10,
              overflow: "hidden",
              shadowColor: "#FF932E",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <LinearGradient
              colors={["#FF932E", "#FFB86C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 20, borderRadius: 18 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <FontAwesome5
                  name="user-friends"
                  size={28}
                  color="#fff"
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 18,
                    flex: 1,
                  }}
                >
                  Ready to connect?
                </Text>
              </View>
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 15,
                  marginBottom: 18,
                }}
              >
                Start your journey by creating a call and discover amazing
                Buddis to help your family!
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 999,
                  paddingVertical: 12,
                  paddingHorizontal: 28,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: "#FF932E",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 2,
                }}
                onPress={() => router.push("/parent/call-page")}
                activeOpacity={0.85}
              >
                <FontAwesome5
                  name="search"
                  size={18}
                  color="#FF932E"
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    color: "#FF932E",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                  }}
                >
                  Find Your Buddi Now
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          // Show first call card and See More if needed
          <>
            <LinearGradient
              colors={["#FF932E", "#FFB86C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 18,
                marginTop: 18,
                marginBottom: 10,
                overflow: "hidden",
                shadowColor: "#FF932E",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 4,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* Icon with colored circle */}
              <View
                style={{
                  marginRight: 18,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 2,
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.18)",
                    borderRadius: 999,
                    padding: 14,
                    marginBottom: 4,
                    borderWidth: 2,
                    borderColor: "#fff",
                    shadowColor: "#fff",
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  {(() => {
                    const status = pickupRequests[0].status;
                    switch (status) {
                      case "pending":
                        return (
                          <FontAwesome5
                            name="hourglass-half"
                            size={28}
                            color="#fff"
                          />
                        );
                      case "matched":
                        return (
                          <FontAwesome5
                            name="user-friends"
                            size={28}
                            color="#fff"
                          />
                        );
                      case "completed":
                        return (
                          <FontAwesome5
                            name="check-circle"
                            size={28}
                            color="#fff"
                          />
                        );
                      default:
                        return (
                          <FontAwesome5
                            name="info-circle"
                            size={28}
                            color="#fff"
                          />
                        );
                    }
                  })()}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                {/* Status-specific message */}
                {pickupRequests[0].status === "matched" ? (
                  <>
                    {/* Matched Status - Special Layout */}
                    <View
                      style={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.2)",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontFamily: "Comfortaa-Bold",
                            fontSize: 16,
                          }}
                        >
                          🎉 Successfully Matched!
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 14,
                          lineHeight: 20,
                        }}
                      >
                        A Buddi has been assigned to your request. Review their
                        profile and get ready for pickup!
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    {/* Other Statuses - Original Layout */}
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 15,
                        marginBottom: 10,
                      }}
                    >
                      {pickupRequests[0].status === "pending"
                        ? "Your call is being processed. We will notify you once a Buddi is matched!"
                        : "Your call is being processed."}
                    </Text>
                  </>
                )}

                {/* Description and Status - Only show for non-matched statuses */}
                {pickupRequests[0].status !== "matched" && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <FontAwesome5
                        name="align-left"
                        size={16}
                        color="#fff"
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 15,
                          marginRight: 6,
                        }}
                      >
                        Description:
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 15,
                          flexShrink: 1,
                        }}
                      >
                        {pickupRequests[0].description}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <FontAwesome5
                        name="info-circle"
                        size={16}
                        color="#fff"
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 15,
                          marginRight: 6,
                        }}
                      >
                        Status:
                      </Text>
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 15,
                        }}
                      >
                        {pickupRequests[0].status === "pending"
                          ? "Under Review"
                          : pickupRequests[0].status.charAt(0).toUpperCase() +
                            pickupRequests[0].status.slice(1)}
                      </Text>
                    </View>
                  </>
                )}
                {/* Action Buttons - Different for matched status */}
                {pickupRequests[0].status === "matched" ? (
                  <>
                    {/* View Recommendations Button for Matched Status */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 999,
                        paddingVertical: 10,
                        paddingHorizontal: 24,
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 14,
                        shadowColor: "#FF932E",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 6,
                        elevation: 3,
                      }}
                      onPress={() =>
                        router.push({
                          pathname: "/parent/buddi-recommendations/[callId]",
                          params: { callId: pickupRequests[0].id.toString() },
                        })
                      }
                      activeOpacity={0.85}
                    >
                      <FontAwesome5
                        name="users"
                        size={16}
                        color="#FF932E"
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{
                          color: "#FF932E",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 15,
                        }}
                      >
                        View Matched Buddi
                      </Text>
                    </TouchableOpacity>
                    {/* See More Button */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: 999,
                        paddingVertical: 8,
                        paddingHorizontal: 20,
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.3)",
                      }}
                      onPress={() => router.push("/parent/my-calls")}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 14,
                          marginRight: 6,
                        }}
                      >
                        See All Calls
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Original buttons for other statuses */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 999,
                        paddingVertical: 8,
                        paddingHorizontal: 22,
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 14,
                        shadowColor: "#FF932E",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                      onPress={() => router.push("/parent/my-calls")}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={{
                          color: "#FF932E",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 15,
                          marginRight: 8,
                        }}
                      >
                        See More
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={18}
                        color="#FF932E"
                      />
                    </TouchableOpacity>
                    {/* Create Another Call Button */}
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 999,
                        paddingVertical: 8,
                        paddingHorizontal: 22,
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 10,
                        shadowColor: "#FF932E",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                      onPress={() => router.push("/parent/call-page")}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={{
                          color: "#FF932E",
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 15,
                          marginRight: 8,
                        }}
                      >
                        Create Another Call
                      </Text>
                      <Ionicons
                        name="add-circle-outline"
                        size={18}
                        color="#FF932E"
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </LinearGradient>
          </>
        )}

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
        {/* Callup Review */}

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
