import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SuccessScreen from "../../../../components/commons/SuccessScreen";

const PRIMARY_COLOR = "#FF932E";
const STEPS = ["Registration", "School Details"];

const RegistrationStep = ({ onLogin }: { onLogin: () => void }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 20,
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
          <Text className="text-sm font-comfortaa text-center text-gray-600 mb-6 px-8">
            Join Pickup Buddi to help us verify Buddis and keep students safe.
            Let&apos;s start by gathering a few details.
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
              value={firstName}
              onChangeText={setFirstName}
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
              value={lastName}
              onChangeText={setLastName}
              placeholder="Smith"
              placeholderTextColor="#A0A0A0"
            />
            <TouchableOpacity className="absolute right-3 top-8">
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              Password
            </Text>
            <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4">
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
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              Confirm Password
            </Text>
            <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4">
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
              value={email}
              onChangeText={setEmail}
              placeholder="johndoe@example.com"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#A0A0A0"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
          <Text className="font-comfortaa text-xs text-gray-400 mt-1">
            Use a valid .ed email
          </Text>
        </View>

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
              value={phone}
              onChangeText={setPhone}
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
        </View>

        <View className="mt-2 mb-4">
          <TouchableOpacity onPress={onLogin} className="self-center">
            <Text className="text-center font-comfortaa text-gray-600">
              Already got any account?{" "}
              <Text className="text-primary font-comfortaa-bold">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const SchoolDetailsStep = () => {
  const [school, setSchool] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [location, setLocation] = useState("");
  const [position, setPosition] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 20,
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
            School Details
          </Text>
          <Text className="text-sm font-comfortaa text-center text-gray-600 mb-6 px-8">
            Provide your school information to help us verify your role and
            build trust.
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            Current School
          </Text>
          <TextInput
            className="bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3 font-comfortaa text-gray-700 text-base"
            value={school}
            onChangeText={setSchool}
            placeholder="School name here"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            School Email
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
              value={schoolEmail}
              onChangeText={setSchoolEmail}
              placeholder="'.edu' email"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#A0A0A0"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
          <Text className="font-comfortaa text-xs text-gray-400 mt-1">
            (Optional)
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            Location of the school
          </Text>
          <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
            <Ionicons
              name="location-outline"
              size={20}
              color="#A0A0A0"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 font-comfortaa text-gray-700 text-base"
              value={location}
              onChangeText={setLocation}
              placeholder="Enter school location"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            Position
          </Text>
          <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
            <Ionicons
              name="briefcase-outline"
              size={20}
              color="#A0A0A0"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 font-comfortaa text-gray-700 text-base"
              value={position}
              onChangeText={setPosition}
              placeholder="Enter your position"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View className="flex-row items-center mb-8 mt-4">
          <TouchableOpacity
            onPress={() => setTermsAccepted(!termsAccepted)}
            className="mr-2"
          >
            <View
              className={`w-5 h-5 border rounded ${
                termsAccepted
                  ? "border-primary bg-primary"
                  : "border-gray-300 bg-white"
              } justify-center items-center`}
            >
              {termsAccepted && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          <Text className="font-comfortaa text-sm text-gray-600">
            I agree to the{" "}
            <Text className="text-primary font-comfortaa-bold">Terms</Text> &{" "}
            <Text className="text-primary font-comfortaa-bold">Conditions</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const HeadTeacherSignup = () => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  if (completed) {
    return (
      <SuccessScreen
        title="Registration Successful!"
        description="Your account has been created successfully. You can now start using the app."
        buttonText="Continue to Home"
        onContinue={() => router.push("/")}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Step Content */}
      {step === 0 && <RegistrationStep onLogin={handleLogin} />}
      {step === 1 && <SchoolDetailsStep />}

      {/* Bottom Buttons */}
      <View className="flex-row justify-between items-center px-6 pb-6">
        {step > 0 && (
          <TouchableOpacity
            className="flex-row items-center px-6 py-3 rounded-full border border-gray-300 bg-white"
            onPress={handleBack}
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
          className={`flex-row items-center px-8 py-3 rounded-full ${
            step === 0 ? "ml-auto" : ""
          }`}
          style={{ backgroundColor: PRIMARY_COLOR }}
          onPress={handleNext}
        >
          <Text className="font-comfortaa-bold text-white mr-2 text-base">
            Next
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Decorative Orange Element */}
      <View
        style={{ position: "absolute", right: -60, bottom: -60, zIndex: -1 }}
      >
        <Image
          source={require("../../../../assets/images/onboarding/bottom_right.png")}
          style={{ width: 100, height: 50 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HeadTeacherSignup;
