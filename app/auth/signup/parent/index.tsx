import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
const STEPS = ["Registration", "Child Information", "Payment"];

const RegistrationStep = ({ onLogin }: { onLogin: () => void }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");

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
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <View className="w-full h-full rounded-full bg-[#E5F2FF] items-center justify-center">
                <Ionicons name="person" size={64} color="#A0CBFF" />
              </View>
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
            <Text className="text-center text-primary font-comfortaa-bold">
              Already got any account?{" "}
              <Text className="text-primary font-comfortaa-bold">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const ChildInformationStep = () => {
  const [school, setSchool] = useState("");
  const [address, setAddress] = useState("");
  const [numberOfKids, setNumberOfKids] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

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
            Tell us more about you child
          </Text>
          <Text className="text-sm font-comfortaa text-center text-gray-500 mb-6 px-8">
            Help us get to know your child(ren) to match them with the perfect
            Buddi.
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
            placeholder="John Doe"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            Home Address
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
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            How many of your kids need the service?
          </Text>
          <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
            <Ionicons
              name="people-outline"
              size={20}
              color="#A0A0A0"
              style={{ marginRight: 8 }}
            />
            <TextInput
              className="flex-1 font-comfortaa text-gray-700 text-base"
              value={numberOfKids}
              onChangeText={setNumberOfKids}
              placeholder="Enter number"
              placeholderTextColor="#A0A0A0"
              keyboardType="number-pad"
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

const PaymentStep = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

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
          <Text className="text-2xl font-comfortaa-bold text-center text-gray-800">
            Complete Background
          </Text>
          <Text className="text-2xl font-comfortaa-bold text-center text-gray-800 mb-2">
            Check Payment
          </Text>
          <Text className="text-sm font-comfortaa text-center text-gray-500 mb-6 px-6">
            Secure your child &apos;s safety and peace of mind. A small fee
            covers a thorough Buddi background screening.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="font-comfortaa-bold text-base text-gray-800 mb-4">
            <Ionicons
              name="card-outline"
              size={20}
              color="#333"
              style={{ marginRight: 4 }}
            />{" "}
            Choose a Payment Method
          </Text>

          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setPaymentMethod("credit")}
              className={`flex-row items-center border rounded-xl py-3 px-4 ${
                paymentMethod === "credit"
                  ? "border-primary bg-[#FFF5E6]"
                  : "border-gray-200"
              }`}
              style={{ flex: 1 }}
            >
              <View
                className="w-5 h-5 rounded-full border mr-2 items-center justify-center"
                style={{
                  borderColor:
                    paymentMethod === "credit" ? PRIMARY_COLOR : "#CBD5E1",
                  backgroundColor: "white",
                }}
              >
                {paymentMethod === "credit" && (
                  <View className="w-3 h-3 rounded-full bg-primary" />
                )}
              </View>
              <View className="flex-1">
                <Text className="font-comfortaa-bold text-sm text-gray-700">
                  Credit or debit card
                </Text>
              </View>
              <View className="flex-row">
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/825/825510.png",
                  }}
                  style={{ width: 24, height: 16, marginRight: 4 }}
                />
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/179/179431.png",
                  }}
                  style={{ width: 24, height: 16, marginRight: 4 }}
                />
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/349/349228.png",
                  }}
                  style={{ width: 24, height: 16 }}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setPaymentMethod("paypal")}
              className={`flex-row items-center border rounded-xl py-3 px-4 ${
                paymentMethod === "paypal"
                  ? "border-primary bg-[#FFF5E6]"
                  : "border-gray-200"
              }`}
              style={{ flex: 1 }}
            >
              <View
                className="w-5 h-5 rounded-full border mr-2 items-center justify-center"
                style={{
                  borderColor:
                    paymentMethod === "paypal" ? PRIMARY_COLOR : "#CBD5E1",
                  backgroundColor: "white",
                }}
              >
                {paymentMethod === "paypal" && (
                  <View className="w-3 h-3 rounded-full bg-primary" />
                )}
              </View>
              <Text className="font-comfortaa-bold text-sm text-gray-700">
                PayPal
              </Text>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/174/174861.png",
                }}
                style={{ width: 24, height: 24, marginLeft: "auto" }}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-6">
            <TouchableOpacity
              onPress={() => setPaymentMethod("apple")}
              className={`flex-row items-center border rounded-xl py-3 px-4 ${
                paymentMethod === "apple"
                  ? "border-primary bg-[#FFF5E6]"
                  : "border-gray-200"
              }`}
              style={{ flex: 1 }}
            >
              <View
                className="w-5 h-5 rounded-full border mr-2 items-center justify-center"
                style={{
                  borderColor:
                    paymentMethod === "apple" ? PRIMARY_COLOR : "#CBD5E1",
                  backgroundColor: "white",
                }}
              >
                {paymentMethod === "apple" && (
                  <View className="w-3 h-3 rounded-full bg-primary" />
                )}
              </View>
              <Text className="font-comfortaa-bold text-sm text-gray-700">
                Apple Pay
              </Text>
              <Ionicons
                name="logo-apple"
                size={24}
                color="#000"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          </View>

          {paymentMethod === "credit" && (
            <View>
              <Text className="font-comfortaa-bold text-base text-gray-800 mb-4">
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#333"
                  style={{ marginRight: 4 }}
                />{" "}
                Card Information
              </Text>

              <View className="mb-4">
                <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
                  Card number
                </Text>
                <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
                  <TextInput
                    className="flex-1 font-comfortaa text-gray-700 text-base"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="number-pad"
                  />
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/349/349228.png",
                    }}
                    style={{ width: 24, height: 16, marginLeft: 8 }}
                  />
                </View>
              </View>

              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
                    Expiry Date
                  </Text>
                  <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
                    <TextInput
                      className="flex-1 font-comfortaa text-gray-700 text-base"
                      value={expiry}
                      onChangeText={setExpiry}
                      placeholder="02/28"
                      placeholderTextColor="#A0A0A0"
                      keyboardType="number-pad"
                    />
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#A0A0A0"
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
                    CVC/CVV
                  </Text>
                  <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3">
                    <TextInput
                      className="flex-1 font-comfortaa text-gray-700 text-base"
                      value={cvv}
                      onChangeText={setCvv}
                      placeholder="356"
                      placeholderTextColor="#A0A0A0"
                      keyboardType="number-pad"
                      secureTextEntry
                    />
                    <TouchableOpacity>
                      <Ionicons
                        name="information-circle-outline"
                        size={20}
                        color="#A0A0A0"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View className="mt-4 bg-[#F3FCF7] p-3 rounded-xl flex-row items-center">
            <Ionicons
              name="shield-checkmark"
              size={24}
              color="#4ADE80"
              className="mr-2"
            />
            <Text className="text-[#4ADE80] font-comfortaa text-sm ml-2">
              Payment is secure and encrypted
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default function ParentSignup() {
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
        onContinue={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Step Content */}
      {step === 0 && <RegistrationStep onLogin={handleLogin} />}
      {step === 1 && <ChildInformationStep />}
      {step === 2 && <PaymentStep />}

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
}
