import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const { width, height } = Dimensions.get("window");

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  onClose,
  onSave,
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
      Keyboard.dismiss();

      // Filter out empty password field if not provided
      const updateData = { ...formData };
      if (!updateData.password) {
        updateData.password = undefined;
      }

      await updateProfile(updateData);

      Alert.alert("Success", "Profile updated successfully!");

      // Call onSave callback if provided
      if (onSave) {
        onSave();
      }

      onClose();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Keyboard.dismiss();
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
        <Text className="text-[#71727A] font-comfortaa-bold text-base">
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
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={() => Keyboard.dismiss()}
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
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              <Text className="font-comfortaa-bold text-lg text-black mt-3">
                {user?.firstName} {user?.lastName}
              </Text>
            </View>

            {/* Form Fields */}
            <ScrollView
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <InputField
                label="First Name"
                value={formData.firstName}
                onChangeText={(value: string) => handleInputChange("firstName", value)}
                placeholder="Enter your first name"
                icon="person-outline"
                autoCapitalize="words"
              />

              <InputField
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value: string) => handleInputChange("lastName", value)}
                placeholder="Enter your last name"
                icon="person-outline"
                autoCapitalize="words"
              />

              <InputField
                label="Email"
                value={formData.email}
                onChangeText={(value: string) => handleInputChange("email", value)}
                placeholder="Enter your email"
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputField
                label="Phone Number"
                value={formData.phoneNumber}
                onChangeText={(value: string) => handleInputChange("phoneNumber", value)}
                placeholder="Enter your phone number"
                icon="call-outline"
                keyboardType="phone-pad"
              />

              <InputField
                label="Home Address"
                value={formData.homeAddress}
                onChangeText={(value: string) => handleInputChange("homeAddress", value)}
                placeholder="Enter your home address"
                icon="home-outline"
                multiline={true}
                numberOfLines={3}
              />

              <InputField
                label="New Password (Optional)"
                value={formData.password}
                onChangeText={(value: string) => handleInputChange("password", value)}
                placeholder="Enter new password (leave blank to keep current)"
                icon="lock-closed-outline"
                secureTextEntry={true}
                autoCapitalize="none"
              />

              {/* Spacer for bottom padding */}
              <View className="h-8" />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProfileEditModal;
