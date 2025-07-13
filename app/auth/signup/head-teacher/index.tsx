import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CountryPicker, Country } from "react-native-country-codes-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import SuccessScreen from "../../../../components/commons/SuccessScreen";
import CountryPickerHeader from "../../../../components/commons/CountryPickerHeader";
import authService from "../../../../services/api/auth.service";

const PRIMARY_COLOR = "#FF932E";
const STEPS = ["Registration", "School Details"];

const RegistrationStep = ({
  form,
  setForm,
  countryCode,
  setCountryCode,
  country,
  setCountry,
  onLogin,
  errors,
}: any) => {
  const [showCountryPicker, setShowCountryPicker] = useState(false);

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
              value={form.firstName}
              onChangeText={v => setForm((f: any) => ({ ...f, firstName: v }))}
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
              value={form.lastName}
              onChangeText={v => setForm((f: any) => ({ ...f, lastName: v }))}
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

        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            Home Address
          </Text>
          <TextInput
            className="bg-white border border-[#CBD5E1] rounded-2xl px-4 py-3 font-comfortaa text-gray-700 text-base"
            value={form.homeAddress}
            onChangeText={v => setForm((f: any) => ({ ...f, homeAddress: v }))}
            placeholder="Enter your home address"
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <View style={{ flexDirection: "row", gap: 16, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
              Password
            </Text>
            <View className="flex-row items-center bg-white border border-[#CBD5E1] rounded-2xl px-4">
              <TextInput
                className="flex-1 font-comfortaa text-gray-700 text-base py-3"
                value={form.password}
                onChangeText={v => setForm((f: any) => ({ ...f, password: v }))}
                placeholder="********"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!form.showPassword}
              />
              <TouchableOpacity onPress={() => setForm((f: any) => ({ ...f, showPassword: !f.showPassword }))}>
                <Ionicons
                  name={form.showPassword ? "eye" : "eye-off"}
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
                value={form.confirmPassword}
                onChangeText={v => setForm((f: any) => ({ ...f, confirmPassword: v }))}
                placeholder="********"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!form.showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setForm((f: any) => ({ ...f, showConfirmPassword: !f.showConfirmPassword }))}
              >
                <Ionicons
                  name={form.showConfirmPassword ? "eye" : "eye-off"}
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
              value={form.email}
              onChangeText={v => setForm((f: any) => ({ ...f, email: v }))}
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
            Use a valid .edu email please 
          </Text>
          {errors.email ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.email}</Text> : null}
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text className="font-comfortaa-bold text-xs text-gray-500 mb-1">
            Phone Number
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#CBD5E1', height: 52, paddingHorizontal: 8 }}>
            <TouchableOpacity
              onPress={() => setShowCountryPicker(true)}
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}
            >
              <Text style={{ fontSize: 16, color: '#333', fontFamily: 'Comfortaa-Medium' }}>
                {form.countryCallingCode ? `+${form.countryCallingCode}` : '+1'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#666" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            <TextInput
              value={form.phoneNumber}
              onChangeText={v => setForm((f: any) => ({ ...f, phoneNumber: v }))}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              style={{ flex: 1, fontFamily: "comfortaa-medium", color: "#374151", fontSize: 14 }}
            />
          </View>
          {errors.phoneNumber ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.phoneNumber}</Text> : null}
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

      {/* Country Picker Modal */}
      <CountryPicker
        show={showCountryPicker}
        pickerButtonOnPress={(item: Country) => {
          setForm((f: any) => ({ ...f, countryCallingCode: item.dial_code }));
          setCountryCode(item.code);
          setCountry(item);
          setShowCountryPicker(false);
        }}
        popularCountries={['US', 'CA', 'GB', 'AU', 'DE', 'FR']}
        ListHeaderComponent={props => <CountryPickerHeader {...props} onClose={() => setShowCountryPicker(false)} />}
        lang="en"
        style={{
          modal: {
            backgroundColor: '#fff',
            flex: 1,
            margin: 0,
            marginTop: 50,
          },
          backdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1,
          },
          textInput: {
            height: 50,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            paddingHorizontal: 16,
            fontSize: 16,
            fontFamily: 'Comfortaa-Medium',
            marginHorizontal: 16,
            marginBottom: 16,
          },
          countryButtonStyles: {
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6',
          },
          countryName: {
            fontSize: 12,
            fontFamily: 'Comfortaa-Medium',
            color: '#374151',
            maxWidth: 120,
          },
          dialCode: {
            fontSize: 14,
            fontFamily: 'Comfortaa-Medium',
            color: '#6B7280',
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

const SchoolDetailsStep = ({ form, setForm, errors }: any) => {
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
            value={form.schoolName}
            onChangeText={v => setForm((f: any) => ({ ...f, schoolName: v }))}
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
              value={form.schoolEmail}
              onChangeText={v => setForm((f: any) => ({ ...f, schoolEmail: v }))}
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
          {errors.schoolEmail ? <Text style={{ color: 'red', fontSize: 12 }}>{errors.schoolEmail}</Text> : null}
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
              value={form.schoolLocation}
              onChangeText={v => setForm((f: any) => ({ ...f, schoolLocation: v }))}
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
              value={form.position}
              onChangeText={v => setForm((f: any) => ({ ...f, position: v }))}
              placeholder="Enter your position"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View className="flex-row items-center mb-8 mt-4">
          <TouchableOpacity
            onPress={() => setForm((f: any) => ({ ...f, termsAccepted: !f.termsAccepted }))}
            className="mr-2"
          >
            <View
              className={`w-5 h-5 border rounded ${
                form.termsAccepted
                  ? "border-primary bg-primary"
                  : "border-gray-300 bg-white"
              } justify-center items-center`}
            >
              {form.termsAccepted && (
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

function validateForm(form: any) {
  const errors: any = {};
  if (!form.firstName) errors.firstName = 'First name is required';
  if (!form.lastName) errors.lastName = 'Last name is required';
  if (!form.homeAddress) errors.homeAddress = 'Home address is required';
  if (!form.email) errors.email = 'Email is required';
  else if (!/^[^@\s]+@[^@\s]+\.edu$/.test(form.email)) errors.email = 'Email must be a .edu email';
  if (!form.password) errors.password = 'Password is required';
  else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(form.password)) errors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
  if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  if (!form.phoneNumber) errors.phoneNumber = 'Phone number is required';
  if (!form.countryCallingCode) errors.phoneNumber = 'Select country code';
  if (!form.schoolName) errors.schoolName = 'School name is required';
  if (form.schoolEmail && !/^[^@\s]+@[^@\s]+\.edu$/.test(form.schoolEmail)) errors.schoolEmail = 'School email must be a .edu email';
  if (!form.position) errors.position = 'Position is required';
  if (!form.termsAccepted) errors.termsAccepted = 'You must accept the terms';
  return errors;
}

const HeadTeacherSignup = () => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    homeAddress: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    countryCallingCode: '',
    phoneNumber: '',
    schoolName: '',
    schoolEmail: '',
    schoolLocation: '',
    position: '',
    termsAccepted: false,
  });
  const [countryCode, setCountryCode] = useState<string>('US');
  const [country, setCountry] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Validate all fields
      const validationErrors = validateForm(form);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
      setLoading(true);
      try {
        const payload = {
          email: form.email,
          password: form.password,
          phoneNumber: `${form.countryCallingCode}${form.phoneNumber}`,
          firstName: form.firstName,
          lastName: form.lastName,
          homeAddress: form.homeAddress,
          schoolName: form.schoolName,
          schoolEmail: form.schoolEmail,
          position: form.position,
        };
        await authService.registerReferralTeacher(payload);
        setCompleted(true);
      } catch (e: any) {
        setErrors({ api: e.message || 'Registration failed' });
      } finally {
        setLoading(false);
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

  if (completed) {
    return (
      <SuccessScreen
        title="Registration Successful!"
        description="Your account has been created successfully. You can now start using the app."
        buttonText="Continue to Login"
        onContinue={() => router.push("/auth/login")}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Step Content */}
      {step === 0 && (
        <RegistrationStep
          form={form}
          setForm={setForm}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          country={country}
          setCountry={setCountry}
          onLogin={handleLogin}
          errors={errors}
        />
      )}
      {step === 1 && (
        <SchoolDetailsStep form={form} setForm={setForm} errors={errors} />
      )}

      {/* Bottom Buttons */}
      <View className="flex-row justify-between items-center px-6 pb-6">
        {step > 0 && (
          <TouchableOpacity
            className="flex-row items-center px-6 py-3 rounded-full border border-gray-300 bg-white"
            onPress={handleBack}
            disabled={loading}
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
          style={{ backgroundColor: PRIMARY_COLOR, opacity: loading ? 0.7 : 1 }}
          onPress={handleNext}
          disabled={loading}
        >
          <Text className="font-comfortaa-bold text-white mr-2 text-base">
            {loading ? 'Please wait...' : 'Next'}
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
      {errors.api ? (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errors.api}</Text>
      ) : null}
    </SafeAreaView>
  );
};

export default HeadTeacherSignup;
