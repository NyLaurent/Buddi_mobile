import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";
const STEPS = [
  "Registration",
  "Academic Details",
  "Resume Upload",
  "Availability Preferences",
  "References",
];

// Step 1: Registration
const RegistrationStep = () => (
  <View className="w-full items-center">
    <Image
      source={require("../../assets/images/logo.png")}
      className="w-40 h-12 mb-4"
      resizeMode="contain"
    />
    <Text className="text-xl font-comfortaa-bold text-center text-gray-800 mb-2">
      Registration
    </Text>
    {/* Profile photo, name, email, etc. */}
    {/* ... Add your form fields here ... */}
    <View className="w-full items-center mt-4">
      <View className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 items-center justify-center mb-2">
        <Ionicons name="person" size={48} color="#A0A0A0" />
        <TouchableOpacity className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
          <Ionicons name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text className="font-comfortaa text-xs text-gray-500 mb-2">
        Add a Profile Photo
      </Text>
    </View>
    {/* Example fields */}
    <View className="w-full flex-row space-x-2 mb-2 px-2">
      <View className="flex-1">
        <Text className="font-comfortaa text-xs text-gray-500 mb-1">
          First Name
        </Text>
        <View className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <Text className="font-comfortaa text-gray-700">John Doe</Text>
        </View>
      </View>
      <View className="flex-1">
        <Text className="font-comfortaa text-xs text-gray-500 mb-1">
          Last Name
        </Text>
        <View className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          <Text className="font-comfortaa text-gray-700">Smith</Text>
        </View>
      </View>
    </View>
    {/* ... Add more fields as needed ... */}
  </View>
);

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

const Auth = () => {
  const [step, setStep] = useState(0);
  const StepComponent = StepComponents[step];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-between min-h-screen">
          <View className="w-full flex-1 items-center justify-center">
            <StepComponent />
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
            <TouchableOpacity
              className="flex-row items-center px-6 py-3 rounded-full border border-gray bg-white"
              disabled={step === 0}
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
            <TouchableOpacity
              className="flex-row items-center px-8 py-3 rounded-full bg-primary"
              style={{ backgroundColor: PRIMARY_COLOR, opacity: 1 }}
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
    </SafeAreaView>
  );
};

export default Auth;
