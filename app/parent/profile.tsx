import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileEditModal from "../../components/commons/ProfileEditModal";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/api/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProfileData {
  user: {
    userId: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    homeAddress: string;
    role: string;
    Parent: {
      id: string;
      childrenCount: number | null;
      approvalStage: string;
      paymentMethod: string;
      bgcStatus: string;
      isBgCheckPaid: boolean;
      createdAt: string;
      updatedAt: string;
      profilePicture?: string;
    };
  };
}

export default function ParentProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user, parentDetails, refreshUserData, logout } = useAuth();

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await authService.getProfile();
      setProfileData(response);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    await refreshUserData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      await fetchProfileData();
      await refreshUserData();
      setShowProfileEdit(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0]?.toUpperCase() || ""}${
      lastName?.[0]?.toUpperCase() || ""
    }`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#16A34A";
      case "pending":
        return "#F97316";
      case "rejected":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending Approval";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await authService.deleteAccount();
              Alert.alert(
                "Account Deleted", 
                "Your account has been deleted successfully. You will be logged out.",
                [
                  {
                    text: "OK",
                    onPress: async () => {
                      // Clear stored data and logout
                      await AsyncStorage.removeItem("parentPickups");
                      await logout();
                      router.replace("/auth/login");
                    }
                  }
                ]
              );
            } catch (error: any) {
              console.error("Error deleting account:", error);
              let errorMessage = "Failed to delete account. Please try again.";
              
              // Check if user has active pickup requests
              if (error?.response?.data?.error?.includes("foreign key constraint")) {
                errorMessage = `Cannot delete account: ${user?.firstName || 'You'} have active pickup requests. Please cancel all requests first, then try again.`;
              } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else if (error?.message) {
                errorMessage = error.message;
              }
              
              Alert.alert("Error", errorMessage);
            }
          }
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FF932E" />
          <Text
            style={{
              marginTop: 16,
              fontFamily: "Comfortaa-Regular",
              color: "#71727A",
            }}
          >
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Comfortaa-Bold",
            color: "#374151",
            flex: 1,
          }}
        >
          Profile
        </Text>
        <TouchableOpacity
          onPress={() => setShowProfileEdit(true)}
          style={{ padding: 8 }}
        >
          <Ionicons name="create-outline" size={24} color="#FF932E" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View
          style={{
            alignItems: "center",
            paddingVertical: 32,
            backgroundColor: "#FFF7ED",
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 16,
          }}
        >
          {/* Avatar */}
          <View style={{ marginBottom: 16 }}>
            {parentDetails?.profilePicture ? (
              <Image
                source={{ uri: parentDetails.profilePicture }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 4,
                  borderColor: "#FF932E",
                }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "#FFD9B3",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 4,
                  borderColor: "#FF932E",
                }}
              >
                <Text
                  style={{
                    fontSize: 36,
                    color: "#FF932E",
                    fontFamily: "Comfortaa-Bold",
                  }}
                >
                  {getInitials(
                    profileData?.user?.firstName || "",
                    profileData?.user?.lastName || ""
                  )}
                </Text>
              </View>
            )}
          </View>

          {/* Name */}
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Comfortaa-Bold",
              color: "#374151",
              marginBottom: 4,
            }}
          >
            {profileData?.user?.firstName} {profileData?.user?.lastName}
          </Text>

          {/* Email */}
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Comfortaa-Regular",
              color: "#6B7280",
              marginBottom: 8,
            }}
          >
            {profileData?.user?.email}
          </Text>

          {/* Status Badge */}
          <View
            style={{
              backgroundColor: getStatusColor(
                profileData?.user?.Parent?.approvalStage || ""
              ),
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                fontFamily: "Comfortaa-Bold",
              }}
            >
              {getStatusText(profileData?.user?.Parent?.approvalStage || "")}
            </Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Comfortaa-Bold",
              color: "#374151",
              marginBottom: 16,
            }}
          >
            Personal Information
          </Text>

          {/* Phone Number */}
          <View
            style={{
              backgroundColor: "#F9FAFB",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="call-outline"
              size={20}
              color="#6B7280"
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Comfortaa-Regular",
                  color: "#6B7280",
                  marginBottom: 2,
                }}
              >
                Phone Number
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Comfortaa-Medium",
                  color: "#374151",
                }}
              >
                {profileData?.user?.phoneNumber || "Not provided"}
              </Text>
            </View>
          </View>

          {/* Home Address */}
          <View
            style={{
              backgroundColor: "#F9FAFB",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="home-outline"
              size={20}
              color="#6B7280"
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Comfortaa-Regular",
                  color: "#6B7280",
                  marginBottom: 2,
                }}
              >
                Home Address
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Comfortaa-Medium",
                  color: "#374151",
                }}
              >
                {profileData?.user?.homeAddress || "Not provided"}
              </Text>
            </View>
          </View>

          {/* Account Information */}
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Comfortaa-Bold",
              color: "#374151",
              marginTop: 24,
              marginBottom: 16,
            }}
          >
            Account Information
          </Text>

          {/* Payment Method */}
          <View
            style={{
              backgroundColor: "#F9FAFB",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="card-outline"
              size={20}
              color="#6B7280"
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Comfortaa-Regular",
                  color: "#6B7280",
                  marginBottom: 2,
                }}
              >
                Payment Method
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Comfortaa-Medium",
                  color: "#374151",
                }}
              >
                {profileData?.user?.Parent?.paymentMethod
                  ? profileData.user.Parent.paymentMethod
                      .replace("_", " ")
                      .toUpperCase()
                  : "Not set"}
              </Text>
            </View>
          </View>

          {/* Background Check Status */}
          <View
            style={{
              backgroundColor: "#F9FAFB",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={
                profileData?.user?.Parent?.isBgCheckPaid
                  ? "checkmark-circle-outline"
                  : "alert-circle-outline"
              }
              size={20}
              color={
                profileData?.user?.Parent?.isBgCheckPaid ? "#16A34A" : "#F97316"
              }
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Comfortaa-Regular",
                  color: "#6B7280",
                  marginBottom: 2,
                }}
              >
                Background Check
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Comfortaa-Medium",
                  color: profileData?.user?.Parent?.isBgCheckPaid
                    ? "#16A34A"
                    : "#F97316",
                }}
              >
                {profileData?.user?.Parent?.isBgCheckPaid
                  ? "Completed"
                  : "Not Completed"}
              </Text>
            </View>
          </View>

          {/* Member Since */}
          <View
            style={{
              backgroundColor: "#F9FAFB",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#6B7280"
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Comfortaa-Regular",
                  color: "#6B7280",
                  marginBottom: 2,
                }}
              >
                Member Since
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Comfortaa-Medium",
                  color: "#374151",
                }}
              >
                {profileData?.user?.Parent?.createdAt
                  ? new Date(
                      profileData.user.Parent.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#FF932E",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 12,
            }}
            onPress={() => router.push("/parent/background-check")}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontFamily: "Comfortaa-Bold",
              }}
            >
              Complete Background Check
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#F3F4F6",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 12,
            }}
            onPress={() => router.push("/parent/payments")}
          >
            <Text
              style={{
                color: "#374151",
                fontSize: 16,
                fontFamily: "Comfortaa-Bold",
              }}
            >
              Manage Payment Methods
            </Text>
          </TouchableOpacity>

          {/* Delete Account Section */}
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Comfortaa-Regular",
                color: "#6B7280",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Have you read well the policies of deleting account?
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#FEF2F2",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
              onPress={handleDeleteAccount}
            >
              <Text
                style={{
                  color: "#EF4444",
                  fontSize: 16,
                  fontFamily: "Comfortaa-Bold",
                }}
              >
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
        onSave={handleProfileUpdate}
      />
    </SafeAreaView>
  );
}