import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
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
import { ParentRegistrationRequest } from "../../../../services/api/types";

const PRIMARY_COLOR = "#FF932E";
const STEPS = ["Registration", "Payment"];

interface FormData {
  // Registration data
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  countryCallingCode: string;
  firstName: string;
  lastName: string;

  // Child information
  homeAddress: string;
  termsAccepted: boolean;

  // Payment data
  paymentMethod: "credit_card" | "debit_card" | "paypal";
  cardDetails: {
    cardNumber: string;
    expiry: string;
    cvv: string;
  } | null;
}

const initialFormData: FormData = {
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  countryCallingCode: "US",
  firstName: "",
  lastName: "",
  homeAddress: "",
  termsAccepted: false,
  paymentMethod: "credit_card",
  cardDetails: null, // This will be ignored
};

interface StepProps {
  onLogin?: () => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

function validateForm(formData: FormData, step: number) {
  const errors: any = {};
  if (step === 0) {
    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]).{8,}$/.test(
        formData.password
      )
    ) {
      errors.password =
        "Your password isn't strong enough. It must be at least 8 characters and include:\n- An uppercase letter\n- A lowercase letter\n- A number\n- A special character (e.g. !@#$%^&*)";
    }
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!formData.countryCallingCode)
      errors.phoneNumber = "Select country code";
    if (!formData.homeAddress) errors.homeAddress = "Home address is required";
  }
  if (step === 1) {
    if (!formData.termsAccepted)
      errors.termsAccepted = "You must accept the terms";
  }
  // Do NOT check cardDetails at all
  return errors;
}

const RegistrationStep: React.FC<
  StepProps & {
    errors: any;
    countryCode: string;
    setCountryCode: any;
    country: Country | null;
    setCountry: any;
  }
> = ({
  onLogin,
  formData,
  setFormData,
  errors,
  countryCode,
  setCountryCode,
  country,
  setCountry,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

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
          <Text className="text-2xl font-comfortaa-bold text-center text-black mb-2">
            Registration
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
            {errors.firstName && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
                {errors.firstName}
              </Text>
            )}
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
            {errors.lastName && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
                {errors.lastName}
              </Text>
            )}
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
              placeholder="johndoe@example.com"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && (
            <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
              {errors.email}
            </Text>
          )}
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
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ marginRight: 8 }}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#A0A0A0"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text
                style={{
                  color: "red",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {errors.password}
              </Text>
            )}
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
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ marginRight: 8 }}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#A0A0A0"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
                {errors.confirmPassword}
              </Text>
            )}
          </View>
        </View>

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
                  ? formData.countryCallingCode
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
                setFormData((prev) => ({ ...prev, phoneNumber: text }))
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
          {errors.phoneNumber && (
            <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
              {errors.phoneNumber}
            </Text>
          )}
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-[#71727A] mb-1">
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
              className="flex-1 font-comfortaa text-[#71727A] text-base"
              value={formData.homeAddress}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, homeAddress: text }))
              }
              placeholder="Enter your address"
              placeholderTextColor="#A0A0A0"
            />
          </View>
          {errors.homeAddress && (
            <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
              {errors.homeAddress}
            </Text>
          )}
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

      {/* Country Picker Modal */}
      <CountryPicker
        show={showCountryPicker}
        pickerButtonOnPress={(item: Country) => {
          setFormData((prev) => ({
            ...prev,
            countryCallingCode: item.dial_code,
          }));
          setCountryCode(item.code);
          setCountry(item);
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
    </View>
  );
};

const PaymentStep: React.FC<StepProps & { errors: any }> = ({
  formData,
  setFormData,
  errors,
}) => {
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
          <Text className="text-2xl font-comfortaa-bold text-center text-black mb-2">
            Payment Section
          </Text>
          <Text className="text-sm font-comfortaa text-center text-[#71727A] mb-6 px-6">
            Please select your preferred payment method to continue your
            registration.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="font-comfortaa-bold text-base text-black mb-4">
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
              onPress={() =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMethod: "credit_card",
                }))
              }
              className={`flex-row items-center border rounded-xl py-3 px-4 ${
                formData.paymentMethod === "credit_card"
                  ? "border-primary bg-[#FFF5E6]"
                  : "border-gray-200"
              }`}
              style={{ flex: 1 }}
            >
              <View
                className="w-5 h-5 rounded-full border mr-2 items-center justify-center"
                style={{
                  borderColor:
                    formData.paymentMethod === "credit_card"
                      ? PRIMARY_COLOR
                      : "#CBD5E1",
                  backgroundColor: "white",
                }}
              >
                {formData.paymentMethod === "credit_card" && (
                  <View className="w-3 h-3 rounded-full bg-primary" />
                )}
              </View>
              <View className="flex-1">
                <Text className="font-comfortaa-bold text-sm text-[#71727A]">
                  Credit Card
                </Text>
              </View>
              {/* You can keep card icons here if you want */}
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() =>
                setFormData((prev) => ({
                  ...prev,
                  paymentMethod: "debit_card",
                }))
              }
              className={`flex-row items-center border rounded-xl py-3 px-4 ${
                formData.paymentMethod === "debit_card"
                  ? "border-primary bg-[#FFF5E6]"
                  : "border-gray-200"
              }`}
              style={{ flex: 1 }}
            >
              <View
                className="w-5 h-5 rounded-full border mr-2 items-center justify-center"
                style={{
                  borderColor:
                    formData.paymentMethod === "debit_card"
                      ? PRIMARY_COLOR
                      : "#CBD5E1",
                  backgroundColor: "white",
                }}
              >
                {formData.paymentMethod === "debit_card" && (
                  <View className="w-3 h-3 rounded-full bg-primary" />
                )}
              </View>
              <Text className="font-comfortaa-bold text-sm text-[#71727A]">
                Debit Card
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-6">
            <TouchableOpacity
              onPress={() =>
                setFormData((prev) => ({ ...prev, paymentMethod: "paypal" }))
              }
              className={`flex-row items-center border rounded-xl py-3 px-4 ${
                formData.paymentMethod === "paypal"
                  ? "border-primary bg-[#FFF5E6]"
                  : "border-gray-200"
              }`}
              style={{ flex: 1 }}
            >
              <View
                className="w-5 h-5 rounded-full border mr-2 items-center justify-center"
                style={{
                  borderColor:
                    formData.paymentMethod === "paypal"
                      ? PRIMARY_COLOR
                      : "#CBD5E1",
                  backgroundColor: "white",
                }}
              >
                {formData.paymentMethod === "paypal" && (
                  <View className="w-3 h-3 rounded-full bg-primary" />
                )}
              </View>
              <Text className="font-comfortaa-bold text-sm text-[#71727A]">
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

          {/* Customization message */}
          <View style={{ marginBottom: 16 }}>
            <Text className="font-comfortaa text-center text-[#71727A] text-sm">
              You may customize your mode of payment later.
            </Text>
          </View>

          {/* Terms and Conditions */}
          <View className="flex-row items-center mt-6 mb-4">
            <TouchableOpacity
              onPress={() =>
                setFormData((prev) => ({
                  ...prev,
                  termsAccepted: !prev.termsAccepted,
                }))
              }
              className="mr-2"
            >
              <View
                className={`w-5 h-5 border rounded ${
                  formData.termsAccepted
                    ? "border-primary bg-primary"
                    : "border-gray-300 bg-white"
                } justify-center items-center`}
              >
                {formData.termsAccepted && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
            <Text className="font-comfortaa text-sm text-[#71727A]">
              I agree to the{" "}
              <Text className="text-primary font-comfortaa-bold">Terms</Text> &{" "}
              <Text className="text-primary font-comfortaa-bold">
                Conditions
              </Text>
            </Text>
          </View>
          {errors.termsAccepted && (
            <Text style={{ color: "red", fontSize: 12, marginBottom: 16 }}>
              {errors.termsAccepted}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default function ParentSignup() {
  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [countryCode, setCountryCode] = useState<string>("US");
  const [country, setCountry] = useState<Country | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleNext = async () => {
    const validationErrors = validateForm(formData, step);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      // Show the first error message found
      const firstErrorKey = Object.keys(validationErrors)[0];
      const firstErrorMsg = validationErrors[firstErrorKey];
      Alert.alert(
        "Validation Error",
        firstErrorMsg ||
        "Please complete all required fields before proceeding."
      );
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Final step - submit the form
      try {
        setIsLoading(true);
        // Prepare registration data
        const registrationData: ParentRegistrationRequest = {
          email: formData.email,
          password: formData.password,
          phoneNumber: `${formData.countryCallingCode}${formData.phoneNumber}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          homeAddress: formData.homeAddress,
          paymentMethod: formData.paymentMethod,
          // cardDetails is NOT sent
        };
        const response = await authService.registerParent(registrationData);
        console.log("Registration successful:", response);
        // Show success screen for 3 seconds then navigate to login
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/auth/login");
        }, 3000);
      } catch (error: any) {
        console.error("Registration error:", error);
        // Try to extract a specific error message from backend
        let backendMsg = error?.response?.data?.message || error?.message;
        if (backendMsg) {
          Alert.alert("Registration Failed", backendMsg);
        } else {
        Alert.alert(
          "Registration Failed",
            "An error occurred during registration. Please try again."
        );
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSuccessContinue = () => {
    setShowSuccess(false);
    router.push("/auth/login");
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        title="Registration Successful!"
        description="Your account has been created successfully. Please check your email for further instructions."
        buttonText="Continue to Login"
        onContinue={handleSuccessContinue}
        primaryColor={PRIMARY_COLOR}
        imagePath={require("../../../../assets/images/onboarding/success.png")}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#ffffff" translucent={false} />

      {/* Step Content */}
      {step === 0 && (
        <RegistrationStep
          onLogin={handleLogin}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          country={country}
          setCountry={setCountry}
        />
      )}
      {step === 1 && (
        <PaymentStep
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      )}

      {/* Progress Stepper */}
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

      {/* Bottom Buttons */}
      <View className="flex-row justify-between items-center px-6 pb-6">
        {step > 0 && (
          <TouchableOpacity
            className="flex-row items-center px-6 py-3 rounded-full border border-gray-300 bg-white"
            onPress={handleBack}
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
          className={`flex-row items-center px-8 py-3 rounded-full ${
            step === 0 ? "ml-auto" : ""
          }`}
          style={{
            backgroundColor: PRIMARY_COLOR,
            opacity: isLoading ? 0.7 : 1,
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
                name={step === STEPS.length - 1 ? "checkmark" : "arrow-forward"}
                size={18}
                color="#fff"
              />
            </>
          )}
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
