import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
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
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#FF932E";
const STEPS = [
  "Registration",
  "Academic Details",
  "Resume Upload",
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
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("+44");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

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
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              Date Of Birth
            </Text>
            <TouchableOpacity
              onPress={() => setShowDate(true)}
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#CBD5E1",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
                height: 52,
              }}
            >
              <Text className="font-comfortaa text-gray-700 flex-1 text-base">
                {dob ? dob.toLocaleDateString() : "00/00/0000"}
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
                selectedValue={gender}
                onValueChange={setGender}
                style={{
                  fontFamily: "Comfortaa",
                  color: gender === GENDERS[0] ? "#A0A0A0" : "#374151",
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
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setShowCountryPicker(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#CBD5E1",
                  borderRadius: 16,
                  height: 52,
                  paddingLeft: 16,
                  paddingRight: 12,
                  marginRight: 12,
                  width: 130,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <CountryPicker
                    countryCode={countryCode}
                    withFlag
                    withEmoji={false}
                    withFilter
                    withCallingCode
                    withCallingCodeButton={false}
                    onSelect={(country: Country) => {
                      setCountryCode(country.cca2);
                      if (
                        country.callingCode &&
                        country.callingCode.length > 0
                      ) {
                        setCallingCode(`+${country.callingCode[0]}`);
                      }
                    }}
                    visible={showCountryPicker}
                    onClose={() => setShowCountryPicker(false)}
                    containerButtonStyle={{
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 4,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: "comfortaa-medium",
                      fontSize: 16,
                      color: "#374151",
                      fontWeight: "500",
                    }}
                  >
                    {callingCode}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={16} color="#A0A0A0" />
              </TouchableOpacity>
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
                  placeholder="(000)000-0000"
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
const AcademicStep = () => {
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [gpa, setGpa] = useState("");
  const [gradYear, setGradYear] = useState<Date | null>(null);
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
          value={school}
          onChangeText={setSchool}
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
          value={major}
          onChangeText={setMajor}
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
            value={gpa}
            onChangeText={setGpa}
            placeholder="3.5"
            placeholderTextColor="#A0A0A0"
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
          Graduation Year
        </Text>
        <TouchableOpacity
          onPress={() => setShowGradDate(true)}
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#CBD5E1",
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            height: 52,
          }}
        >
          <Text className="font-comfortaa text-gray-700 flex-1 text-base">
            {gradYear ? gradYear.toLocaleDateString() : "00/00/0000"}
          </Text>
          <Ionicons name="calendar" size={20} color="#A0A0A0" />
        </TouchableOpacity>
        {showGradDate && (
          <DateTimePicker
            value={gradYear || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => {
              setShowGradDate(false);
              if (date) setGradYear(date);
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

// Step 3: Resume Upload
const ResumeStep = () => {
  const [resumeFile, setResumeFile] = useState<any>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      // Handle new API format (Expo SDK 46+)
      if (
        "canceled" in result &&
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        setResumeFile(result.assets[0]);
      }
      // Handle old API format (before Expo SDK 46)
      else if ("type" in result && result.type === "success") {
        setResumeFile(result);
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
          {resumeFile ? (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="document-text" size={64} color="#A0A0A0" />
              <Text className="font-comfortaa text-sm text-gray-700 mt-2">
                {resumeFile.name ||
                  resumeFile.uri?.split("/").pop() ||
                  "Selected file"}
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
          Allowed formats: .pdf, .doc, .docx
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
const ReferencesStep = () => {
  const [referralEmail, setReferralEmail] = useState("");
  const [referralPhone, setReferralPhone] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("+44");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

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

      <View style={{ marginTop: 20 }}>
        <Text className="font-comfortaa-bold text-center text-gray-700 text-lg mb-4">
          Add Head Teacher&apos;s Contact Info
        </Text>

        {/* Email Field */}
        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            Referral&apos;s Email
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
              value={referralEmail}
              onChangeText={setReferralEmail}
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
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setShowCountryPicker(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#CBD5E1",
                borderRadius: 16,
                height: 52,
                paddingLeft: 16,
                paddingRight: 12,
                marginRight: 12,
                width: 130,
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CountryPicker
                  countryCode={countryCode}
                  withFlag
                  withEmoji={false}
                  withFilter
                  withCallingCode
                  withCallingCodeButton={false}
                  onSelect={(country: Country) => {
                    setCountryCode(country.cca2);
                    if (country.callingCode && country.callingCode.length > 0) {
                      setCallingCode(`+${country.callingCode[0]}`);
                    }
                  }}
                  visible={showCountryPicker}
                  onClose={() => setShowCountryPicker(false)}
                  containerButtonStyle={{
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 4,
                  }}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "comfortaa-medium",
                    fontSize: 16,
                    color: "#374151",
                    fontWeight: "500",
                  }}
                >
                  {callingCode}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={16} color="#A0A0A0" />
            </TouchableOpacity>
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
                value={referralPhone}
                onChangeText={setReferralPhone}
                placeholder="(000)000-0000"
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
      </View>

      <Text className="font-comfortaa text-center text-gray-500 px-8 mt-8">
        Your references help us ensure the best match for families.
      </Text>
    </ScrollView>
  );
};

// Success Screen after signup completion
const SuccessScreen = ({ onContinue }: { onContinue: () => void }) => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={require("../../../../assets/images/logo.png")}
          className="w-40 h-12 mb-12"
          resizeMode="contain"
        />

        {/* Empty placeholder for success image */}
        <View
          style={{
            width: 150,
            height: 150,
            marginBottom: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../../../assets/images/onboarding/success.png")}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />

          {/* Image will be added by the user later */}
        </View>

        <Text className="text-2xl font-comfortaa-bold text-center text-primary mb-2">
          You&apos;re All Set!
        </Text>

        <Text className="font-comfortaa text-center text-gray-500 mb-8">
          Your account is ready, let&apos;s start for your better financial
          experience
        </Text>

        {/* Continue Button */}
        <TouchableOpacity
          className="py-3 rounded-full w-64 mt-4"
          style={{
            backgroundColor: PRIMARY_COLOR,
            paddingHorizontal: 20,
          }}
          onPress={onContinue}
        >
          <Text className="font-comfortaa-bold text-white text-center text-lg">
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Orange Element - positioned exactly like other screens */}
      <View
        style={{
          position: "absolute",
          right: -30,
          bottom: 0,
          opacity: 0.5,
          zIndex: -10,
          width: 160,
          height: 160,
        }}
      >
        <Image
          source={require("../../../../assets/images/onboarding/bottom_right.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>
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
  const [showWaitlist, setShowWaitlist] = useState(false);
  const StepComponent = StepComponents[step];

  const handleNext = () => {
    if (step === STEPS.length - 1) {
      // On final step, show success screen
      setShowSuccess(true);
    } else {
      // Otherwise move to next step
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    }
  };

  const handleContinue = () => {
    // Navigate to waitlist screen
    setShowSuccess(false);
    setShowWaitlist(true);
  };

  if (showWaitlist) {
    // Import WaitlistScreen dynamically
    const WaitlistScreen = require("../../waitlist").default;
    return <WaitlistScreen />;
  }

  if (showSuccess) {
    return <SuccessScreen onContinue={handleContinue} />;
  }

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
          <View className="flex-row justify-between items-center px-4 mb-8 w-full">
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
              onPress={handleNext}
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
}
