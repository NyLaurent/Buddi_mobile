import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CoverageAlertCard from "../../components/admin/CoverageAlertCard";
import AnalyticsCard from "../../components/commons/AnalyticsCard";
import ReferencedStudentProfileCard from "../../components/head-teacher/ReferencedStudentProfileCard";
import { useAuth } from "../../context/AuthContext";

const HeadTeacherDashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

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
      // For web, use window.alert as fallback
      if (typeof window !== "undefined") {
        window.alert("Failed to logout. Please try again.");
      }
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
        <View className="flex-row justify-between items-center px-1 pt-6">
          <View>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[75px] h-[40px]"
              resizeMode="contain"
            />
            {user && (
              <Text className="text-lg text-black px-3 font-comfortaa-bold mt-1">
                Hello, {user.firstName}
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-2 pr-1">
            <TouchableOpacity className="p-2 bg-primary rounded-xl shadow-sm">
              <Ionicons name="search-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-primary rounded-xl shadow-sm">
              <Ionicons name="notifications-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 bg-red-500 rounded-xl shadow-sm"
              onPress={() => {
                console.log("TouchableOpacity pressed!"); // Simple test
                handleLogout();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Analytics Cards Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginTop: 12,
            paddingHorizontal: 16,
            paddingTop: 8,
          }}
        >
          <View style={{ width: "48%", marginBottom: 16 }}>
            <AnalyticsCard
              title="Students who referenced you"
              value="12"
              subtitle="2 Schools"
              icon={
                <Ionicons
                  name="flash-outline"
                  size={36}
                  color="#2EC8FF"
                  style={{
                    backgroundColor: "#E6F7FF",
                    borderRadius: 24,
                    padding: 8,
                  }}
                />
              }
            />
          </View>
          <View style={{ width: "48%", marginBottom: 16 }}>
            <AnalyticsCard
              title="Students who referenced you"
              value="12"
              subtitle="2 Schools"
              icon={
                <Ionicons
                  name="flash-outline"
                  size={36}
                  color="#2EC8FF"
                  style={{
                    backgroundColor: "#E6F7FF",
                    borderRadius: 24,
                    padding: 8,
                  }}
                />
              }
            />
          </View>
          <View style={{ width: "48%", marginBottom: 16 }}>
            <AnalyticsCard
              title="Pending"
              value="3"
              subtitle="All time"
              icon={
                <Ionicons
                  name="cash-outline"
                  size={36}
                  color="#7B61FF"
                  style={{
                    backgroundColor: "#F1EDFF",
                    borderRadius: 24,
                    padding: 8,
                  }}
                />
              }
            />
          </View>
          <View style={{ width: "48%", marginBottom: 16 }}>
            <AnalyticsCard
              title="Rejected"
              value="3"
              subtitle="All time"
              icon={
                <Ionicons
                  name="cash-outline"
                  size={36}
                  color="#7B61FF"
                  style={{
                    backgroundColor: "#F1EDFF",
                    borderRadius: 24,
                    padding: 8,
                  }}
                />
              }
            />
          </View>
        </View>
        {/* School Coverage Card */}
        <View style={{ marginHorizontal: 8, marginBottom: 24 }}>
          <CoverageAlertCard
            title="School, Name"
            subtitle="Your school has student buddis working the after school pickups for young brothers and sisters"
            description=""
            primaryButton={{
              label: "View All Buddis from your school",
              icon: (
                <Ionicons
                  name="sync-outline"
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 6 }}
                />
              ),
              onPress: () => {},
            }}
          />
        </View>
        {/* Profile Reviews Section */}
        <View style={{ marginTop: 8, marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 16,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#23272F",
                fontFamily: "Comfortaa-Bold",
              }}
            >
              Profile Reviews
            </Text>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text
                style={{
                  color: "#FF9100",
                  fontSize: 15,
                  fontFamily: "Comfortaa-Bold",
                  marginRight: 4,
                }}
              >
                View All
              </Text>
              <Ionicons
                name="arrow-forward-outline"
                size={16}
                color="#FF9100"
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          >
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={{ width: 270, marginRight: 8 }}>
                <ReferencedStudentProfileCard
                  image={require("../../assets/images/parent/no-buddi.png")}
                  name="Brian Ford"
                  email="brianford@lok.com"
                  phone="1-212-1234567"
                  status="Active"
                  date="23, May, 2025"
                  time="2:01 pm"
                  onViewProfile={() => {}}
                  // Override button for 'Provide review'
                  buttonLabel="Provide review"
                  buttonIcon={
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                  }
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default HeadTeacherDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
