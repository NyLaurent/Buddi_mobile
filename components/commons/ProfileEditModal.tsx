import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  onClose,
}) => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    homeAddress: string;
    password?: string; // Optional for password change
  }>({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    homeAddress: user?.homeAddress || "",
    password: "",
  });

  // Reset form data when modal opens
  useEffect(() => {
    if (visible) {
      setFormData({
        email: user?.email || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phoneNumber: user?.phoneNumber || "",
        homeAddress: user?.homeAddress || "",
        password: "",
      });
    }
  }, [visible, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Filter out empty password field if not provided
      const updateData = { ...formData };
      if (!updateData.password) {
        updateData.password = undefined;
      }

      await updateProfile(updateData);

      Alert.alert("Success", "Profile updated successfully!");
      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    keyboardType = "default",
    autoCapitalize = "words",
    secureTextEntry = false,
    multiline = false,
    numberOfLines = 1,
  }: any) => (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 bg-[#FF932E]/10 rounded-full items-center justify-center mr-3">
          <Ionicons name={icon} size={16} color="#FF932E" />
        </View>
        <Text className="text-gray-700 font-comfortaa-bold text-base">
          {label}
        </Text>
      </View>
      <View className="relative">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-4 font-comfortaa text-base"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
        />
        <View className="absolute right-4 top-4">
          <Ionicons name="create-outline" size={20} color="#D1D5DB" />
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-white">
          {/* Header with Gradient */}
          <LinearGradient
            colors={["#FF932E", "#FF7A00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="pt-12 pb-6 px-6"
          >
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleCancel}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text className="font-comfortaa-bold text-xl text-white">
                Edit Profile
              </Text>
              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading}
                className="bg-white/20 px-6 py-2 rounded-full"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-comfortaa-bold">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Profile Avatar Section */}
          <View className="items-center py-6 bg-gray-50">
            <View className="relative">
              <View className="w-20 h-20 bg-gradient-to-br from-[#FF932E] to-[#FF7A00] rounded-full items-center justify-center">
                <Text className="text-white font-comfortaa-bold text-2xl">
                  {user?.firstName?.charAt(0) || "U"}
                </Text>
              </View>
              <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FF932E] rounded-full items-center justify-center border-2 border-white">
                <Ionicons name="camera" size={12} color="white" />
              </View>
            </View>
            <Text className="font-comfortaa-bold text-lg text-gray-800 mt-3">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-gray-500 font-comfortaa text-sm">
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "User"}
            </Text>
          </View>

          {/* Form Content */}
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <Text className="font-comfortaa-bold text-lg text-gray-800 mb-6">
                Personal Information
              </Text>

              <InputField
                label="First Name"
                value={formData.firstName}
                onChangeText={(value: string) =>
                  handleInputChange("firstName", value)
                }
                placeholder="Enter your first name"
                icon="person-outline"
              />

              <InputField
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value: string) =>
                  handleInputChange("lastName", value)
                }
                placeholder="Enter your last name"
                icon="person-outline"
              />

              <InputField
                label="Email Address"
                value={formData.email}
                onChangeText={(value: string) =>
                  handleInputChange("email", value)
                }
                placeholder="Enter your email address"
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputField
                label="Phone Number"
                value={formData.phoneNumber}
                onChangeText={(value: string) =>
                  handleInputChange("phoneNumber", value)
                }
                placeholder="Enter your phone number"
                icon="call-outline"
                keyboardType="phone-pad"
              />

              <InputField
                label="Home Address"
                value={formData.homeAddress}
                onChangeText={(value: string) =>
                  handleInputChange("homeAddress", value)
                }
                placeholder="Enter your home address"
                icon="location-outline"
                multiline
                numberOfLines={3}
              />

              <InputField
                label="New Password"
                value={formData.password}
                onChangeText={(value: string) =>
                  handleInputChange("password", value)
                }
                placeholder="Enter new password (optional)"
                icon="lock-closed-outline"
                secureTextEntry
                autoCapitalize="none"
              />

              <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-6">
                <View className="flex-row items-start">
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#3B82F6"
                  />
                  <Text className="text-blue-800 font-comfortaa text-sm ml-2 flex-1">
                    Leave the password field blank if you don&apos;t want to
                    change it. All other fields will be updated immediately.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProfileEditModal;
