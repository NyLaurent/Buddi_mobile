import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";
const STEPS = [
  "Registration",
  "Academic Details",
  "Resume Upload",
  "Availability Preferences",
  "References",
];

const GENDERS = ["Select Gender", "Male", "Female", "Other"];

const RegistrationStep = ({ onLogin }: { onLogin: () => void }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dob, setDob] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [gender, setGender] = useState(GENDERS[0]);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("GB");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
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
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
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
            <Text className="font-comfortaa text-xs text-gray-500 mb-1">
              First Name
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3 font-comfortaa text-gray-700 text-base"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="John"
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa text-xs text-gray-500 mb-1">
              Last Name
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3 font-comfortaa text-gray-700 text-base"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Smith"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa text-xs text-gray-500 mb-1">
            Email
          </Text>
          <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3">
            <Ionicons
              name="mail"
              size={20}
              color="#A0A0A0"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 font-comfortaa text-gray-700 text-base"
              value={email}
              onChangeText={setEmail}
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
            <Text className="font-comfortaa text-xs text-gray-500 mb-1">
              Password
            </Text>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4">
              <TextInput
                className="flex-1 font-comfortaa text-gray-700 text-base py-3"
                value={password}
                onChangeText={setPassword}
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
            <Text className="font-comfortaa text-xs text-gray-500 mb-1">
              Confirm Password
            </Text>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4">
              <TextInput
                className="flex-1 font-comfortaa text-gray-700 text-base py-3"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
            <Text className="font-comfortaa text-xs text-gray-500 mb-1">
              Date Of Birth
            </Text>
            <TouchableOpacity
              onPress={() => setShowDate(true)}
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
                height: 52,
              }}
            >
              <Text className="font-comfortaa text-gray-700 flex-1 text-base">
                {dob ? dob.toLocaleDateString() : "00 / 00 / 0000"}
              </Text>
              <Ionicons name="calendar" size={20} color="#A0A0A0" />
            </TouchableOpacity>
            {showDate && (
              <DateTimePicker
                value={dob || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowDate(false);
                  if (date) setDob(date);
                }}
                maximumDate={new Date()}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa text-xs text-gray-500 mb-1">
              Gender
            </Text>
            <View
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 16,
                paddingHorizontal: 8,
                height: 52,
                justifyContent: "center",
              }}
            >
              <Picker
                selectedValue={gender}
                onValueChange={setGender}
                style={{
                  fontFamily: "Comfortaa",
                  color: gender === GENDERS[0] ? "#A0A0A0" : "#374151",
                  height: 48,
                  width: "100%",
                }}
                dropdownIconColor="#A0A0A0"
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
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa text-xs text-gray-500 mb-1">
              Phone Number
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+44 Phone Number"
              keyboardType="phone-pad"
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                width: "100%",
                height: 52,
                paddingHorizontal: 16,
                fontFamily: "Comfortaa",
                color: "#374151",
                fontSize: 16,
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
const AcademicStep = () => (
  <View className="w-full items-center">
    <Text className="text-xl font-comfortaa-bold text-center text-gray-800 mb-2">
      Fill In Your Academic Details
    </Text>
    {/* ... Add your form fields here ... */}
  </View>
);

// Step 3: Resume Upload
const ResumeStep = () => (
  <View className="w-full items-center">
    <Text className="text-xl font-comfortaa-bold text-center text-gray-800 mb-2">
      Provide Your Resume
    </Text>
    {/* ... Add your upload UI here ... */}
  </View>
);

// Step 4: Availability Preferences
const AvailabilityStep = () => (
  <View className="w-full items-center">
    <Text className="text-xl font-comfortaa-bold text-center text-gray-800 mb-2">
      Availability Preferences
    </Text>
    {/* ... Add your form fields here ... */}
  </View>
);

// Step 5: References
const ReferencesStep = () => (
  <View className="w-full items-center">
    <Text className="text-xl font-comfortaa-bold text-center text-gray-800 mb-2">
      Add References
    </Text>
    {/* ... Add your form fields here ... */}
  </View>
);

const StepComponents = [
  RegistrationStep,
  AcademicStep,
  ResumeStep,
  AvailabilityStep,
  ReferencesStep,
];

const BuddiSignup = () => {
  const [step, setStep] = useState(0);
  const StepComponent = StepComponents[step];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="">
          <View className="">
            <StepComponent onLogin={() => {}} />
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
          <View className="flex-row justify-between items-center px-6 mb-8 w-full">
            {step !== 0 && (
              <TouchableOpacity
                className="flex-row items-center px-6 py-3 rounded-full border border-gray bg-white"
                onPress={() => setStep((s) => Math.max(0, s - 1))}
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
                opacity: 1,
                flex: 1,
                justifyContent: "center",
                marginLeft: step !== 0 ? 16 : 0,
              }}
              onPress={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            >
              <Text className="font-comfortaa-bold text-white mr-2 text-base">
                {step === STEPS.length - 1 ? "Submit" : "Next"}
              </Text>
              <Ionicons
                name={step === STEPS.length - 1 ? "checkmark" : "arrow-forward"}
                size={18}
                color="#fff"
              />
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
};

export default BuddiSignup;
