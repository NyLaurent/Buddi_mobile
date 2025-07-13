import { Image, Text, TouchableOpacity, View } from "react-native";

interface SuccessScreenProps {
  onContinue: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  imagePath?: any;
  primaryColor?: string;
}

const SuccessScreen = ({
  onContinue,
  title = "You're All Set!",
  description = "Your account is ready, let's start for your better financial experience",
  buttonText = "Continue",
  imagePath,
  primaryColor = "#FF932E",
}: SuccessScreenProps) => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-40 h-12 mb-12"
          resizeMode="contain"
        />

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
            source={
              imagePath || require("../../assets/images/onboarding/success.png")
            }
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>

        <Text
          className="text-2xl font-comfortaa-bold text-center mb-2"
          style={{ color: primaryColor }}
        >
          {title}
        </Text>

        <Text className="font-comfortaa text-center text-gray mb-8">
          {description}
        </Text>

        <TouchableOpacity
          className="py-3 rounded-full w-64 mt-4"
          style={{
            backgroundColor: primaryColor,
            paddingHorizontal: 20,
          }}
          onPress={onContinue}
        >
          <Text className="font-comfortaa-bold text-white text-center text-lg">
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>

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
          source={require("../../assets/images/onboarding/bottom_right.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default SuccessScreen;
