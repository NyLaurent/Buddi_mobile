import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SuccessScreen from "../../../../components/commons/SuccessScreen";
import authService from "../../../../services/api/auth.service";
import { BuddiRegistrationRequest } from "../../../../services/api/types";

const PRIMARY_COLOR = "#FF932E";
const STEPS = [
  "Registration",
  "Academic Details",
  "Resume Upload",
  "References",
];

const GENDERS = ["Select Gender", "Male", "Female", "Other"];

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  homeAddress: string;
  currentSchool: string;
  AreaOfStudy: string;
  Gpa: string;
  teacherEmail: string;
  teacherPhoneNumber: string;
  customReferral: string;
  referralOccupation: string;
  resume: File | null;
  gender: string;
  dob: string;
  profilePicture: File | null;
}

const initialFormData: FormData = {
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  firstName: "",
  lastName: "",
  homeAddress: "",
  currentSchool: "",
  AreaOfStudy: "",
  Gpa: "",
  teacherEmail: "",
  teacherPhoneNumber: "",
  customReferral: "",
  referralOccupation: "",
  resume: null,
  gender: GENDERS[0],
  dob: "",
  profilePicture: null,
};

interface StepProps {
  onLogin?: () => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const RegistrationStep: React.FC<StepProps> = ({
  onLogin,
  formData,
  setFormData,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      // Create a File object from the image URI
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 32,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-2">
          <Image
            source={require("../../../../assets/images/logo.png")}
            className="w-40 h-12 mb-4"
            resizeMode="contain"
          />
          <Text className="text-2xl font-comfortaa-bold text-center text-gray-800 mb-2">
            Registration
          </Text>
        </View>
        {/* Profile photo uploader */}
        <View className="items-center mb-6">
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 items-center justify-center mb-2 overflow-hidden relative"
            style={{ borderStyle: "dashed" }}
          >
            {formData.profilePicture ? (
              <Image
                source={{ uri: URL.createObjectURL(formData.profilePicture) }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Ionicons name="person" size={64} color="#A0A0A0" />
            )}
            <View className="absolute bottom-2 right-2 bg-primary rounded-full p-2 border-2 border-white">
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text className="font-comfortaa text-xs text-gray-500 mb-2">
            Add a Profile Photo
          </Text>
        </View>
        {/* Form fields */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              First Name
            </Text>
            <TextInput
              className="bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3 font-comfortaa text-gray-700 text-base"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, firstName: text }))
              }
              placeholder="John Doe"
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              Last Name
            </Text>
            <TextInput
              className="bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3 font-comfortaa text-gray-700 text-base"
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, lastName: text }))
              }
              placeholder="John Doe"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            Email
          </Text>
          <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
            <Ionicons
              name="mail"
              size={20}
              color="#A0A0A0"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 font-comfortaa text-gray-700 text-base"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              placeholder="johndoe@university.edu"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <Text className="font-comfortaa text-xs text-gray-400 mt-1">
            Use a valid .ed email
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              Password
            </Text>
            <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4">
              <TextInput
                className="flex-1 font-comfortaa text-gray-700 text-base py-3"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, password: text }))
                }
                placeholder="********"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#A0A0A0"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              Confirm Password
            </Text>
            <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4">
              <TextInput
                className="flex-1 font-comfortaa text-gray-700 text-base py-3"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: text }))
                }
                placeholder="********"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((v) => !v)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#A0A0A0"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              Date Of Birth
            </Text>
            <View
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#CBD5E1",
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                height: 52,
                paddingLeft: 16,
              }}
            >
              <TextInput
                className="flex-1 font-comfortaa text-gray-700 text-base"
                value={formData.dob ? formData.dob : ""}
                onChangeText={(text) => {
                  // Basic validation for YYYY-MM-DD format
                  if (text.length <= 10 && /^[\d-]*$/.test(text)) {
                    setFormData((prev) => ({ ...prev, dob: text }));
                  }
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#A0A0A0"
              />
              <TouchableOpacity
                onPress={() => setShowDate(true)}
                style={{
                  padding: 12,
                  borderLeftWidth: 1,
                  borderLeftColor: "#CBD5E1",
                }}
              >
                <Ionicons name="calendar" size={20} color="#A0A0A0" />
              </TouchableOpacity>
            </View>
            {showDate && (
              <DateTimePicker
                value={formData.dob ? new Date(formData.dob) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowDate(false);
                  if (date && event.type !== "dismissed") {
                    setFormData((prev) => ({
                      ...prev,
                      dob: date.toISOString().split("T")[0],
                    }));
                  }
                }}
                maximumDate={new Date()}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              Gender
            </Text>
            <View
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#CBD5E1",
                borderRadius: 16,
                paddingHorizontal: 8,
                height: 52,
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
                style={{
                  fontFamily: "Comfortaa",
                  color: formData.gender === GENDERS[0] ? "#A0A0A0" : "#374151",
                  height: 48,
                  width: "100%",
                  marginLeft: -8,
                  marginBottom: 9,
                }}
                dropdownIconColor="#A0A0A0"
                itemStyle={{ fontFamily: "Comfortaa" }}
              >
                {GENDERS.map((g, idx) => (
                  <Picker.Item
                    key={g}
                    label={g}
                    value={g}
                    color={idx === 0 ? "#A0A0A0" : "#374151"}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              Phone Number
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#CBD5E1",
                height: 52,
                paddingHorizontal: 16,
              }}
            >
              <TextInput
                value={formData.phoneNumber}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: text,
                  }))
                }
                placeholder="Example: +250781234567"
                keyboardType="phone-pad"
                style={{
                  flex: 1,
                  fontFamily: "comfortaa-medium",
                  color: "#374151",
                  fontSize: 14,
                }}
              />
            </View>
          </View>
        </View>

        {/* Home Address Field */}
        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            Home Address
          </Text>
          <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
            <Ionicons
              name="home"
              size={20}
              color="#A0A0A0"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 font-comfortaa text-gray-700 text-base"
              value={formData.homeAddress}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, homeAddress: text }))
              }
              placeholder="Example: Kigali, Rwanda"
              placeholderTextColor="#A0A0A0"
              multiline={true}
              numberOfLines={2}
              style={{
                minHeight: 52,
                textAlignVertical: "top",
              }}
            />
          </View>
        </View>

        {/* Login link */}
        <View className="items-center mt-2 mb-6">
          <Text className="font-comfortaa text-gray-400 text-base">
            Already got any account?{" "}
            <Text
              className="text-primary font-comfortaa-bold"
              onPress={onLogin}
              style={{ color: PRIMARY_COLOR }}
            >
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Step 2: Academic Details
const AcademicStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const [showGradDate, setShowGradDate] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 32,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center mb-6">
        <Image
          source={require("../../../../assets/images/logo.png")}
          className="w-40 h-12 mb-4"
          resizeMode="contain"
        />
        <Text className="text-xl font-comfortaa-bold text-center text-gray-800 mb-2">
          Fill In Your Academic Details
        </Text>
        <Text className="font-comfortaa text-center text-gray-500 mb-6 px-6">
          Tell us about your current studies and academic background.
        </Text>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
          Current School
        </Text>
        <TextInput
          className="bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3 font-comfortaa text-gray-700 text-base"
          value={formData.currentSchool}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, currentSchool: text }))
          }
          placeholder="University of Edinburgh"
          placeholderTextColor="#A0A0A0"
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
          Area Of Study (Major)
        </Text>
        <TextInput
          className="bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3 font-comfortaa text-gray-700 text-base"
          value={formData.AreaOfStudy}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, AreaOfStudy: text }))
          }
          placeholder="Computer Science"
          placeholderTextColor="#A0A0A0"
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
          GPA (Optional)
        </Text>
        <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
          <TextInput
            className="flex-1 font-comfortaa text-gray-700 text-base"
            value={formData.Gpa}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, Gpa: text }))
            }
            placeholder="3.5"
            placeholderTextColor="#A0A0A0"
            keyboardType="decimal-pad"
          />
        </View>
      </View>
    </ScrollView>
  );
};

// Step 3: Resume Upload
const ResumeStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          // PDF formats
          "application/pdf",
          // Microsoft Office formats
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          // Image formats
          "image/*",
          // Text formats
          "text/plain",
          // Rich Text Format
          "application/rtf",
          // OpenDocument formats
          "application/vnd.oasis.opendocument.text",
          "application/vnd.oasis.opendocument.spreadsheet",
          "application/vnd.oasis.opendocument.presentation",
        ],
        copyToCacheDirectory: true,
      });

      if (
        "canceled" in result &&
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], result.assets[0].name, {
          type: result.assets[0].mimeType,
        });
        setFormData((prev) => ({ ...prev, resume: file }));
      }
    } catch (error) {
      console.log("Error picking document:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 32,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center mb-6">
        <Image
          source={require("../../../../assets/images/logo.png")}
          className="w-40 h-12 mb-4"
          resizeMode="contain"
        />
        <Text className="text-xl font-comfortaa-bold text-center text-gray-800 mb-2">
          Provide Your Resume
        </Text>
        <Text className="font-comfortaa text-center text-gray-500 mb-8 px-6">
          Help us understand your background better by uploading your most
          recent resume.
        </Text>
      </View>

      <TouchableOpacity
        onPress={pickDocument}
        style={{
          borderWidth: 1,
          borderColor: "#CBD5E1",
          borderStyle: "dashed",
          borderRadius: 16,
          padding: 24,
          marginHorizontal: 24,
          marginBottom: 32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ marginBottom: 16 }}>
          {formData.resume ? (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="document-text" size={64} color="#A0A0A0" />
              <Text className="font-comfortaa text-sm text-gray-700 mt-2">
                {formData.resume.name}
              </Text>
            </View>
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                backgroundColor: "#A0A0A0",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Ionicons name="arrow-up" size={40} color="#FFFFFF" />
            </View>
          )}
        </View>
        <Text className="font-comfortaa-bold text-gray-700 text-base mb-2">
          Upload Your Resume here
        </Text>
        <Text className="font-comfortaa text-xs text-gray-500">
          Allowed formats: PDF, Word, Images, and more
        </Text>
      </TouchableOpacity>

      <Text className="font-comfortaa text-center text-gray-500 px-8 mt-4">
        Your resume helps us understand your background and experience. Make
        sure it reflects your strengths clearly.
      </Text>
    </ScrollView>
  );
};

// Step 4: References
const ReferencesStep: React.FC<StepProps> = ({ formData, setFormData }) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderHeadTeacherContent = () => (
    <View style={{ marginTop: 24 }}>
      {/* Email Field */}
      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
          Head Teacher&apos;s Email
        </Text>
        <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
          <Ionicons
            name="mail"
            size={20}
            color="#A0A0A0"
            style={{ marginRight: 8 }}
          />
          <TextInput
            className="flex-1 font-comfortaa text-gray-700 text-base"
            value={formData.teacherEmail}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, teacherEmail: text }))
            }
            placeholder="*****************"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Text className="font-comfortaa text-xs text-gray-400 mt-1 italic">
          .edu email required for Head Teacher
        </Text>
      </View>

      {/* Phone Number Field */}
      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
          Phone Number
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#CBD5E1",
            height: 52,
            paddingHorizontal: 16,
          }}
        >
          <TextInput
            value={formData.teacherPhoneNumber}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, teacherPhoneNumber: text }))
            }
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            style={{
              flex: 1,
              fontFamily: "comfortaa-medium",
              color: "#374151",
              fontSize: 14,
            }}
          />
        </View>
      </View>
    </View>
  );

  const renderCustomReferenceContent = () => (
    <View style={{ marginTop: 24 }}>
      {/* Custom Referral Email */}
      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
          Reference Email
        </Text>
        <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
          <Ionicons
            name="mail"
            size={20}
            color="#A0A0A0"
            style={{ marginRight: 8 }}
          />
          <TextInput
            className="flex-1 font-comfortaa text-gray-700 text-base"
            value={formData.customReferral}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, customReferral: text }))
            }
            placeholder="Enter reference email"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Custom Referral Occupation */}
      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
          Reference Occupation
        </Text>
        <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
          <Ionicons
            name="briefcase"
            size={20}
            color="#A0A0A0"
            style={{ marginRight: 8 }}
          />
          <TextInput
            className="flex-1 font-comfortaa text-gray-700 text-base"
            value={formData.referralOccupation}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, referralOccupation: text }))
            }
            placeholder="Enter reference occupation"
            placeholderTextColor="#A0A0A0"
            autoCapitalize="words"
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 32,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center mb-6">
        <Image
          source={require("../../../../assets/images/logo.png")}
          className="w-40 h-12 mb-4"
          resizeMode="contain"
        />
        <Text className="text-xl font-comfortaa-bold text-center text-gray-800 mb-2">
          Add References
        </Text>
        <Text className="font-comfortaa text-center text-gray-500 mb-6 px-6">
          Please provide at least two academic or professional references to
          support your qualifications.
        </Text>
      </View>

      {/* Tab Switcher */}
      <View className="flex-row bg-gray-100 rounded-2xl p-1 mb-4">
        <TouchableOpacity
          onPress={() => setActiveTab(0)}
          style={{
            flex: 1,
            backgroundColor: activeTab === 0 ? "#fff" : "transparent",
            borderRadius: 12,
            padding: 12,
            shadowColor: activeTab === 0 ? "#000" : "transparent",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: activeTab === 0 ? 2 : 0,
          }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons
              name="school"
              size={20}
              color={activeTab === 0 ? PRIMARY_COLOR : "#6B7280"}
              style={{ marginRight: 8 }}
            />
            <Text
              className="font-comfortaa-bold text-sm"
              style={{
                color: activeTab === 0 ? PRIMARY_COLOR : "#6B7280",
                fontFamily: "Comfortaa-Bold",
              }}
            >
              Head Teacher
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(1)}
          style={{
            flex: 1,
            backgroundColor: activeTab === 1 ? "#fff" : "transparent",
            borderRadius: 12,
            padding: 12,
            shadowColor: activeTab === 1 ? "#000" : "transparent",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: activeTab === 1 ? 2 : 0,
          }}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons
              name="person"
              size={20}
              color={activeTab === 1 ? PRIMARY_COLOR : "#6B7280"}
              style={{ marginRight: 8 }}
            />
            <Text
              className="font-comfortaa-bold text-sm"
              style={{
                color: activeTab === 1 ? PRIMARY_COLOR : "#6B7280",
                fontFamily: "Comfortaa-Bold",
              }}
            >
              Custom Reference
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {activeTab === 0
        ? renderHeadTeacherContent()
        : renderCustomReferenceContent()}
    </ScrollView>
  );
};

const StepComponents = [
  RegistrationStep,
  AcademicStep,
  ResumeStep,
  ReferencesStep,
];

export default function BuddiSignup() {
  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const StepComponent = StepComponents[step];
  const router = useRouter();

  const handleNext = async () => {
    if (step === STEPS.length - 1) {
      // On final step, submit the form
      try {
        setIsLoading(true);

        // Map gender to expected format
        const mappedGender =
          formData.gender === "Male"
            ? "MALE"
            : formData.gender === "Female"
            ? "FEMALE"
            : "OTHER";

        // Convert form data to registration request
        const registrationData: BuddiRegistrationRequest = {
          ...formData,
          gender: mappedGender,
          dob: formData.dob
            ? new Date(formData.dob).toISOString().split("T")[0]
            : "",
          resume: formData.resume || undefined,
          profilePicture: formData.profilePicture || undefined,
        };

        const response = await authService.registerBuddi(registrationData);

        console.log("Registration successful:", response);

        // Show success screen for 2 seconds then redirect to login
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } catch (error: any) {
        console.error("Registration error:", error);
        Alert.alert(
          "Registration Failed",
          error.message ||
            "An error occurred during registration. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // Otherwise move to next step
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    }
  };

  const handleContinue = () => {
    // Navigate to login screen
    router.push("/auth/login");
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        onContinue={handleContinue}
        primaryColor={PRIMARY_COLOR}
        imagePath={require("../../../../assets/images/onboarding/success.png")}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
        hidden={false}
        animated={true}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="">
          <View className="">
            <StepComponent
              onLogin={() => router.push("/auth/login")}
              formData={formData}
              setFormData={setFormData}
            />
          </View>
          {/* Stepper */}
          <View className="flex-row justify-center items-center mb-6 mt-4">
            {STEPS.map((_, idx) => (
              <View
                key={idx}
                style={{
                  width: 40,
                  height: 6,
                  borderRadius: 3,
                  marginHorizontal: 4,
                  backgroundColor:
                    idx === step
                      ? PRIMARY_COLOR
                      : idx < step
                      ? "#60D394"
                      : "#E5E7EB",
                }}
              />
            ))}
          </View>
          {/* Navigation Buttons */}
          <View className="flex-row justify-between items-center px-4 mb-8 w-full">
            {step !== 0 && (
              <TouchableOpacity
                className="flex-row items-center px-6 py-3 rounded-full border border-gray bg-white"
                onPress={() => setStep((s) => Math.max(0, s - 1))}
                disabled={isLoading}
              >
                <Ionicons
                  name="arrow-back"
                  size={18}
                  color="#A0A0A0"
                  style={{ marginRight: 6 }}
                />
                <Text className="font-comfortaa-bold text-[#4B5563] text-base">
                  Back
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="flex-row items-center py-3 rounded-full bg-primary"
              style={{
                backgroundColor: PRIMARY_COLOR,
                opacity: isLoading ? 0.7 : 1,
                flex: 1,
                justifyContent: "center",
                marginLeft: step !== 0 ? 16 : 0,
              }}
              onPress={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="font-comfortaa-bold text-white mr-2 text-base">
                    {step === STEPS.length - 1 ? "Submit" : "Next"}
                  </Text>
                  <Ionicons
                    name={
                      step === STEPS.length - 1 ? "checkmark" : "arrow-forward"
                    }
                    size={18}
                    color="#fff"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Decorative Orange Element - match onboarding style */}
      <View
        style={{
          position: "absolute",
          right: -30,
          bottom: 0,
          opacity: 0.5,
          zIndex: -10,
        }}
      >
        <Image
          source={require("../../../../assets/images/onboarding/bottom_right.png")}
          style={{ width: 160, height: 160 }}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}
