import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Country, CountryPicker } from "react-native-country-codes-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import CountryPickerHeader from "../../../../components/commons/CountryPickerHeader";
import SuccessScreen from "../../../../components/commons/SuccessScreen";
import authService from "../../../../services/api/auth.service";

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
  countryCallingCode: string;
  teacherPhoneNumber: string;
  teacherCountryCode: string;
  customReferralPhoneNumber: string;
  customReferralCountryCode: string;
  firstName: string;
  lastName: string;
  homeAddress: string;
  currentSchool: string;
  AreaOfStudy: string;
  Gpa: string;
  teacherEmail: string;
  customReferral: string;
  referralOccupation: string;
  resume: { uri: string; name: string; type: string; size: number } | null;
  gender: string;
  dob: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

const initialFormData: FormData = {
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  countryCallingCode: "",
  teacherPhoneNumber: "",
  teacherCountryCode: "",
  customReferralPhoneNumber: "",
  customReferralCountryCode: "",
  firstName: "",
  lastName: "",
  homeAddress: "",
  currentSchool: "",
  AreaOfStudy: "",
  Gpa: "",
  teacherEmail: "",
  customReferral: "",
  referralOccupation: "",
  resume: null,
  gender: GENDERS[0],
  dob: "",
  showPassword: false,
  showConfirmPassword: false,
};

interface StepProps {
  onLogin?: () => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: any;
  countryCode: string;
  setCountryCode: React.Dispatch<React.SetStateAction<string>>;
  country: Country | null;
  setCountry: React.Dispatch<React.SetStateAction<Country | null>>;
}

// Date format validation helper function
function validateDateFormat(dateString: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  const [year, month, day] = dateString.split("-").map(Number);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// Enhanced validation function with better error messages
function validateForm(formData: FormData, step: number) {
  const errors: any = {};

  if (step === 0) {
    // Registration step validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^@\s]+@[^@\s]+\.edu$/.test(formData.email.trim())) {
      errors.email = "Email must be a valid .edu email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
        formData.password
      )
    ) {
      errors.password =
        "Your password isn't strong enough. It must be at least 8 characters and include:\n- An uppercase letter\n- A lowercase letter\n- A number\n- A special character (e.g. !@#$%^&*)";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{7,15}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.countryCallingCode) {
      errors.phoneNumber = "Please select a country code";
    }

    if (!formData.homeAddress.trim()) {
      errors.homeAddress = "Home address is required";
    } else if (formData.homeAddress.trim().length < 5) {
      errors.homeAddress = "Please enter a complete address";
    }

    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    } else {
      // Validate date format for manual entry
      if (!validateDateFormat(formData.dob)) {
        errors.dob =
          "Please enter date in YYYY-MM-DD format (e.g., 2000-01-15)";
      } else {
        const dobDate = new Date(formData.dob);
        const today = new Date();

        // Check if date is valid
        if (isNaN(dobDate.getTime())) {
          errors.dob = "Please enter a valid date";
        } else {
          // Calculate age more accurately
          let age = today.getFullYear() - dobDate.getFullYear();
          const monthDiff = today.getMonth() - dobDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dobDate.getDate())
          ) {
            age--;
          }

          if (dobDate > today) {
            errors.dob = "Date of birth cannot be in the future";
          } else if (age < 16) {
            errors.dob = "You must be at least 16 years old";
          } else if (age > 100) {
            errors.dob = "Please enter a valid date of birth";
          }
        }
      }
    }

    if (formData.gender === GENDERS[0]) {
      errors.gender = "Please select your gender";
    }
  }

  if (step === 1) {
    // Academic details validation
    if (!formData.currentSchool.trim()) {
      errors.currentSchool = "Current school is required";
    } else if (formData.currentSchool.trim().length < 3) {
      errors.currentSchool = "Please enter a valid school name";
    }

    if (!formData.AreaOfStudy.trim()) {
      errors.AreaOfStudy = "Area of study is required";
    } else if (formData.AreaOfStudy.trim().length < 2) {
      errors.AreaOfStudy = "Please enter a valid area of study";
    }

    if (formData.Gpa && !/^\d+(\.\d{1,2})?$/.test(formData.Gpa)) {
      errors.Gpa = "Please enter a valid GPA (e.g., 3.5)";
    }
  }

  if (step === 3) {
    // References validation
    if (!formData.teacherEmail.trim() && !formData.customReferral.trim()) {
      errors.references =
        "Please provide at least one reference (Head Teacher or Custom Reference)";
    }

    if (
      formData.teacherEmail.trim() &&
      !/^[^@\s]+@[^@\s]+\.edu$/.test(formData.teacherEmail.trim())
    ) {
      errors.teacherEmail = "Head Teacher email must be a valid .edu email";
    }

    if (
      formData.customReferral.trim() &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.customReferral.trim())
    ) {
      errors.customReferral = "Please enter a valid email address";
    }

    if (
      formData.teacherPhoneNumber.trim() &&
      !/^\d{7,15}$/.test(formData.teacherPhoneNumber.trim())
    ) {
      errors.teacherPhoneNumber = "Please enter a valid phone number";
    }

    if (
      formData.customReferralPhoneNumber.trim() &&
      !/^\d{7,15}$/.test(formData.customReferralPhoneNumber.trim())
    ) {
      errors.customReferralPhoneNumber = "Please enter a valid phone number";
    }
  }

  return errors;
}

const RegistrationStep: React.FC<StepProps> = ({
  onLogin,
  formData,
  setFormData,
  errors,
  countryCode,
  setCountryCode,
  country,
  setCountry,
}) => {
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [manualDateEntry, setManualDateEntry] = useState(false);

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  const getDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <View className="items-center mb-6">
          <Image
            source={require("../../../../assets/images/logo.png")}
            className="w-40 h-12 mb-4"
            resizeMode="contain"
          />
          <Text className="text-xl font-comfortaa-bold text-center text-black mb-2">
            Join Pickup Buddi
          </Text>
          <Text className="font-comfortaa text-center text-[#71727A] mb-6 px-6">
            Become a trusted Buddi and help parents with their children&apos;s
            pickup needs.
          </Text>
        </View>

        {/* Form fields */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
              First Name
            </Text>
            <TextInput
              className="bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3 font-comfortaa text-[#71727A] text-base"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, firstName: text }))
              }
              placeholder="John"
              placeholderTextColor="#A0A0A0"
            />
            {errors.firstName ? (
              <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                {errors.firstName}
              </Text>
            ) : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
              Last Name
            </Text>
            <TextInput
              className="bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3 font-comfortaa text-[#71727A] text-base"
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, lastName: text }))
              }
              placeholder="Doe"
              placeholderTextColor="#A0A0A0"
            />
            {errors.lastName ? (
              <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                {errors.lastName}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
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
              className="flex-1 font-comfortaa text-[#71727A] text-base"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              placeholder="johndoe@example.edu"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email ? (
            <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
              {errors.email}
            </Text>
          ) : null}
        </View>

        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
              Password
            </Text>
            <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4">
              <TextInput
                className="flex-1 font-comfortaa text-[#71727A] text-base py-3"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, password: text }))
                }
                placeholder="********"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!formData.showPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  setFormData((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                style={{ marginRight: 8 }}
              >
                <Ionicons
                  name={formData.showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#A0A0A0"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                {errors.password}
              </Text>
            ) : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
              Confirm Password
            </Text>
            <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4">
              <TextInput
                className="flex-1 font-comfortaa text-[#71727A] text-base py-3"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: text }))
                }
                placeholder="********"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!formData.showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  setFormData((prev) => ({
                    ...prev,
                    showConfirmPassword: !prev.showConfirmPassword,
                  }))
                }
                style={{ marginRight: 8 }}
              >
                <Ionicons
                  name={formData.showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#A0A0A0"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                {errors.confirmPassword}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Phone Number Field */}
        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
            Phone Number
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#CBD5E1",
              height: 52,
              paddingHorizontal: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowCountryPicker(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#333",
                  fontFamily: "Comfortaa-Medium",
                }}
              >
                {formData.countryCallingCode
                  ? `+${formData.countryCallingCode}`
                  : "+1"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color="#666"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
            <TextInput
              value={formData.phoneNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: text,
                }))
              }
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              style={{
                flex: 1,
                fontFamily: "comfortaa-medium",
                color: "#374151",
                fontSize: 14,
              }}
            />
          </View>
          {errors.phoneNumber ? (
            <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
              {errors.phoneNumber}
            </Text>
          ) : null}
        </View>

        {/* Home Address Field */}
        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
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
              className="flex-1 font-comfortaa text-[#71727A] text-base"
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
          {errors.homeAddress ? (
            <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
              {errors.homeAddress}
            </Text>
          ) : null}
        </View>

        {/* Date of Birth Field */}
        <View style={{ marginBottom: 20 }}>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-comfortaa-bold text-xs text-[#71727A]">
              Date of Birth
            </Text>
            <TouchableOpacity
              onPress={() => setManualDateEntry(!manualDateEntry)}
              className="flex-row items-center px-3 py-1 rounded-full bg-gray-100"
            >
              <Ionicons
                name={manualDateEntry ? "calendar" : "pencil"}
                size={12}
                color="#666"
                style={{ marginRight: 4 }}
              />
              <Text className="font-comfortaa text-xs text-[#666]">
                {manualDateEntry ? "Use Picker" : "Type Date"}
              </Text>
            </TouchableOpacity>
          </View>

          {manualDateEntry ? (
            <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
              <Ionicons
                name="calendar"
                size={20}
                color="#A0A0A0"
                style={{ marginRight: 8 }}
              />
              <TextInput
                className="flex-1 font-comfortaa text-[#71727A] text-base"
                value={formData.dob}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, dob: text }));
                }}
                placeholder="YYYY-MM-DD (e.g., 2000-01-15)"
                placeholderTextColor="#A0A0A0"
                maxLength={10}
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3"
            >
              <Ionicons
                name="calendar"
                size={20}
                color="#A0A0A0"
                style={{ marginRight: 8 }}
              />
              <Text className="flex-1 font-comfortaa text-[#71727A] text-base">
                {formData.dob ? getDisplayDate(formData.dob) : "Select Date"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#A0A0A0" />
            </TouchableOpacity>
          )}

          {errors.dob ? (
            <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
              {errors.dob}
            </Text>
          ) : null}

          {manualDateEntry && (
            <Text className="font-comfortaa text-xs text-[#71727A] mt-1 opacity-70">
              Format: YYYY-MM-DD (Year-Month-Day) • Must be 16+ years old
            </Text>
          )}
        </View>

        {/* Gender Selection */}
        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
            Gender
          </Text>
          <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
            <Ionicons
              name="person"
              size={20}
              color="#A0A0A0"
              style={{ marginRight: 8 }}
            />
            <View className="flex-1 flex-row">
              {GENDERS.slice(1).map((gender, index) => (
                <TouchableOpacity
                  key={gender}
                  onPress={() => setFormData((prev) => ({ ...prev, gender }))}
                  className="flex-row items-center mr-4"
                >
                  <View
                    className={`w-4 h-4 rounded-full border-2 mr-2 ${
                      formData.gender === gender
                        ? "border-primary bg-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.gender === gender && (
                      <View className="w-2 h-2 rounded-full bg-white m-auto" />
                    )}
                  </View>
                  <Text className="font-comfortaa text-[#71727A] text-sm">
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {errors.gender ? (
            <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
              {errors.gender}
            </Text>
          ) : null}
        </View>

        {/* Login link */}
        <View className="items-center mt-2 mb-6">
          <Text className="font-comfortaa text-[#71727A] text-base">
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

      {/* Country Picker Modal */}
      <CountryPicker
        show={showCountryPicker}
        pickerButtonOnPress={(item: Country) => {
          setCountryCode(item.code);
          setCountry(item);
          setFormData((prev) => ({
            ...prev,
            countryCallingCode: item.dial_code,
          }));
          setShowCountryPicker(false);
        }}
        popularCountries={["US", "CA", "GB", "AU", "DE", "FR"]}
        ListHeaderComponent={(props) => (
          <CountryPickerHeader
            {...props}
            onClose={() => setShowCountryPicker(false)}
          />
        )}
        lang="en"
        style={{
          modal: {
            backgroundColor: "#fff",
            flex: 1,
            margin: 0,
            marginTop: 50,
          },
          backdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
          },
          textInput: {
            height: 50,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            paddingHorizontal: 16,
            fontSize: 16,
            fontFamily: "Comfortaa-Medium",
            marginHorizontal: 16,
            marginBottom: 16,
          },
          countryButtonStyles: {
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          },
          countryName: {
            fontSize: 12,
            fontFamily: "Comfortaa-Medium",
            color: "#374151",
            maxWidth: 120,
          },
          dialCode: {
            fontSize: 14,
            fontFamily: "Comfortaa-Medium",
            color: "#6B7280",
          },
          flag: {
            fontSize: 20,
            marginRight: 12,
          },
          itemsList: {
            flex: 1,
          },
        }}
      />

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display="default"
          value={formData.dob ? new Date(formData.dob) : new Date()}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (event.type === "set" && date) {
              setFormData((prev) => ({ ...prev, dob: formatDate(date) }));
            }
          }}
          minimumDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 100))
          }
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

// Step 2: Academic Details
const AcademicStep: React.FC<StepProps> = ({
  formData,
  setFormData,
  errors,
}) => {
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
        <Text className="text-xl font-comfortaa-bold text-center text-black mb-2">
          Fill In Your Academic Details
        </Text>
        <Text className="font-comfortaa text-center text-[#71727A] mb-6 px-6">
          Tell us about your current studies and academic background.
        </Text>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
          Current School
        </Text>
        <TextInput
          className="bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3 font-comfortaa text-[#71727A] text-base"
          value={formData.currentSchool}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, currentSchool: text }))
          }
          placeholder="University of Edinburgh"
          placeholderTextColor="#A0A0A0"
        />
        {errors.currentSchool ? (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {errors.currentSchool}
          </Text>
        ) : null}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
          Area Of Study (Major)
        </Text>
        <TextInput
          className="bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3 font-comfortaa text-[#71727A] text-base"
          value={formData.AreaOfStudy}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, AreaOfStudy: text }))
          }
          placeholder="Computer Science"
          placeholderTextColor="#A0A0A0"
        />
        {errors.AreaOfStudy ? (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {errors.AreaOfStudy}
          </Text>
        ) : null}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
          GPA (Optional)
        </Text>
        <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
          <TextInput
            className="flex-1 font-comfortaa text-[#71727A] text-base"
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
        // Allow all file types
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (
        "canceled" in result &&
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        const uri = result.assets[0].uri;
        // For React Native, we need to create a file object with URI and metadata
        const file = {
          uri: uri,
          name: result.assets[0].name || "resume.pdf",
          type: result.assets[0].mimeType || "application/pdf",
          size: result.assets[0].size || 0,
        };
        console.log("Resume file created:", file);
        console.log("File name:", file.name);
        console.log("File type:", file.type);
        console.log("File size:", file.size);
        setFormData((prev) => ({ ...prev, resume: file }));
      }
    } catch (error) {
      console.log("Error picking document:", error);
      Alert.alert("Error", "Failed to upload document. Please try again.");
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
        <Text className="text-xl font-comfortaa-bold text-center text-black mb-2">
          Provide Your Resume
        </Text>
        <Text className="font-comfortaa text-center text-[#71727A] mb-8 px-6">
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
              <Text className="font-comfortaa text-sm text-[#71727A] mt-2">
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
        <Text className="font-comfortaa-bold text-[#71727A] text-base mb-2">
          Upload Your Resume here
        </Text>
        <Text className="font-comfortaa text-xs text-[#71727A]">
          All file types are supported
        </Text>
      </TouchableOpacity>

      <Text className="font-comfortaa text-center text-[#71727A] px-8 mt-4">
        Your resume helps us understand your background and experience. Make
        sure it reflects your strengths clearly.
      </Text>
    </ScrollView>
  );
};

// Step 4: References
const ReferencesStep: React.FC<StepProps> = ({
  formData,
  setFormData,
  errors,
  countryCode,
  setCountryCode,
  country,
  setCountry,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [teacherCountryCode, setTeacherCountryCode] = useState<string>("US");
  const [teacherCountry, setTeacherCountry] = useState<Country | null>(null);
  const [customReferralCountryCode, setCustomReferralCountryCode] =
    useState<string>("US");
  const [customReferralCountry, setCustomReferralCountry] =
    useState<Country | null>(null);
  const [showTeacherCountryPicker, setShowTeacherCountryPicker] =
    useState(false);
  const [showCustomReferralCountryPicker, setShowCustomReferralCountryPicker] =
    useState(false);

  const renderHeadTeacherContent = () => (
    <View style={{ marginTop: 24 }}>
      {/* Teacher Email */}
      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
          Teacher Email
        </Text>
        <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
          <Ionicons
            name="mail"
            size={20}
            color="#A0A0A0"
            style={{ marginRight: 8 }}
          />
          <TextInput
            className="flex-1 font-comfortaa text-[#71727A] text-base"
            value={formData.teacherEmail}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, teacherEmail: text }))
            }
            placeholder="teacher@school.edu"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.teacherEmail ? (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {errors.teacherEmail}
          </Text>
        ) : null}
      </View>

      {/* Teacher Phone Number Field */}
      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
          Teacher Phone Number
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#CBD5E1",
            height: 52,
            paddingHorizontal: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowTeacherCountryPicker(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                fontFamily: "Comfortaa-Medium",
              }}
            >
              {formData.teacherCountryCode
                ? `+${formData.teacherCountryCode}`
                : "+1"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#666"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
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
        <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
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
            className="flex-1 font-comfortaa text-[#71727A] text-base"
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
        {errors.customReferral ? (
          <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {errors.customReferral}
          </Text>
        ) : null}
      </View>

      {/* Custom Referral Phone Number Field */}
      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
          Reference Phone Number
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#CBD5E1",
            height: 52,
            paddingHorizontal: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowCustomReferralCountryPicker(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                fontFamily: "Comfortaa-Medium",
              }}
            >
              {formData.customReferralCountryCode
                ? `+${formData.customReferralCountryCode}`
                : "+1"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#666"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
          <TextInput
            value={formData.customReferralPhoneNumber}
            onChangeText={(text) =>
              setFormData((prev) => ({
                ...prev,
                customReferralPhoneNumber: text,
              }))
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

      {/* Custom Referral Occupation */}
      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
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
            className="flex-1 font-comfortaa text-[#71727A] text-base"
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
        <View className="items-center mb-6">
          <Image
            source={require("../../../../assets/images/logo.png")}
            className="w-40 h-12 mb-4"
            resizeMode="contain"
          />
          <Text className="text-xl font-comfortaa-bold text-center text-black mb-2">
            Add References
          </Text>
          <Text className="font-comfortaa text-center text-[#71727A] mb-6 px-6">
            Please provide at least one academic or professional reference to
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
            <Text
              className={`font-comfortaa-bold text-center ${
                activeTab === 0 ? "text-primary" : "text-[#71727A]"
              }`}
            >
              Head Teacher
            </Text>
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
            <Text
              className={`font-comfortaa-bold text-center ${
                activeTab === 1 ? "text-primary" : "text-[#71727A]"
              }`}
            >
              Custom Reference
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 0
          ? renderHeadTeacherContent()
          : renderCustomReferenceContent()}
      </ScrollView>

      {/* Teacher Country Picker Modal */}
      <CountryPicker
        show={showTeacherCountryPicker}
        pickerButtonOnPress={(item: Country) => {
          setTeacherCountryCode(item.code);
          setTeacherCountry(item);
          setFormData((prev) => ({
            ...prev,
            teacherCountryCode: item.dial_code,
          }));
          setShowTeacherCountryPicker(false);
        }}
        popularCountries={["US", "CA", "GB", "AU", "DE", "FR"]}
        ListHeaderComponent={(props) => (
          <CountryPickerHeader
            {...props}
            onClose={() => setShowTeacherCountryPicker(false)}
          />
        )}
        lang="en"
        style={{
          modal: {
            backgroundColor: "#fff",
            flex: 1,
            margin: 0,
            marginTop: 50,
          },
          backdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
          },
          textInput: {
            height: 50,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            paddingHorizontal: 16,
            fontSize: 16,
            fontFamily: "Comfortaa-Medium",
            marginHorizontal: 16,
            marginBottom: 16,
          },
          countryButtonStyles: {
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          },
          countryName: {
            fontSize: 12,
            fontFamily: "Comfortaa-Medium",
            color: "#374151",
            maxWidth: 120,
          },
          dialCode: {
            fontSize: 14,
            fontFamily: "Comfortaa-Medium",
            color: "#6B7280",
          },
          flag: {
            fontSize: 20,
            marginRight: 12,
          },
          itemsList: {
            flex: 1,
          },
        }}
      />

      {/* Custom Referral Country Picker Modal */}
      <CountryPicker
        show={showCustomReferralCountryPicker}
        pickerButtonOnPress={(item: Country) => {
          setCustomReferralCountryCode(item.code);
          setCustomReferralCountry(item);
          setFormData((prev) => ({
            ...prev,
            customReferralCountryCode: item.dial_code,
          }));
          setShowCustomReferralCountryPicker(false);
        }}
        popularCountries={["US", "CA", "GB", "AU", "DE", "FR"]}
        ListHeaderComponent={(props) => (
          <CountryPickerHeader
            {...props}
            onClose={() => setShowCustomReferralCountryPicker(false)}
          />
        )}
        lang="en"
        style={{
          modal: {
            backgroundColor: "#fff",
            flex: 1,
            margin: 0,
            marginTop: 50,
          },
          backdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
          },
          textInput: {
            height: 50,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            paddingHorizontal: 16,
            fontSize: 16,
            fontFamily: "Comfortaa-Medium",
            marginHorizontal: 16,
            marginBottom: 16,
          },
          countryButtonStyles: {
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          },
          countryName: {
            fontSize: 12,
            fontFamily: "Comfortaa-Medium",
            color: "#374151",
            maxWidth: 120,
          },
          dialCode: {
            fontSize: 14,
            fontFamily: "Comfortaa-Medium",
            color: "#6B7280",
          },
          flag: {
            fontSize: 20,
            marginRight: 12,
          },
          itemsList: {
            flex: 1,
          },
        }}
      />
    </View>
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
  const [countryCode, setCountryCode] = useState<string>("US");
  const [country, setCountry] = useState<Country | null>(null);
  const [errors, setErrors] = useState<any>({});
  const StepComponent = StepComponents[step];
  const router = useRouter();

  const handleNext = async () => {
    // Validate current step
    const validationErrors = validateForm(formData, step);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Alert.alert(
        "Validation Error",
        "Please complete all required fields correctly before proceeding."
      );
      return;
    }

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

        // Prepare registration data
        const registrationData = {
          email: formData.email.trim(),
          password: formData.password,
          phoneNumber: `${
            formData.countryCallingCode
          }${formData.phoneNumber.trim()}`,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          homeAddress: formData.homeAddress.trim(),
          currentSchool: formData.currentSchool.trim(),
          AreaOfStudy: formData.AreaOfStudy.trim(),
          Gpa: formData.Gpa.trim() || undefined,
          teacherEmail: formData.teacherEmail.trim() || undefined,
          teacherPhoneNumber: formData.teacherPhoneNumber.trim()
            ? `${
                formData.teacherCountryCode
              }${formData.teacherPhoneNumber.trim()}`
            : undefined,
          customReferral: formData.customReferral.trim() || undefined,
          referralOccupation: formData.referralOccupation.trim() || undefined,
          resume: formData.resume || undefined,
          gender: mappedGender,
          dob: formData.dob
            ? new Date(formData.dob).toISOString().split("T")[0]
            : "",
        };

        console.log("=== REGISTRATION DEBUG INFO ===");
        console.log("DOB Raw:", formData.dob);
        console.log("DOB Processed:", registrationData.dob);
        console.log(
          "Age Check:",
          formData.dob
            ? new Date().getFullYear() - new Date(formData.dob).getFullYear()
            : "No DOB"
        );
        console.log(
          "Full Registration Data:",
          JSON.stringify(registrationData, null, 2)
        );
        console.log("===============================");

        const response = await authService.registerBuddi(registrationData);

        console.log("Registration successful:", response);

        // Show success screen for 3 seconds then redirect to login
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } catch (error: any) {
        console.error("=== REGISTRATION ERROR DEBUG ===");
        console.error("Full error object:", error);
        console.error("Error message:", error.message);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("================================");

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
              errors={errors}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              country={country}
              setCountry={setCountry}
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
