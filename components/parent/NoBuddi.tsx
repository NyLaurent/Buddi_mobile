import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const NoBuddi = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-6 py-10 bg-white">
      {/* Placeholder for the image */}
      <Image
        source={require("../../assets/images/parent/no-buddi.png")} // Replace with your image path
        className="w-32 h-32 mb-6"
        resizeMode="contain"
      />
      <Text className="text-center text-gray font-comfortaa mb-8 text-base">
        You currently have no Buddi!
      </Text>
      <TouchableOpacity
        className="bg-primary flex-row items-center justify-center rounded-full py-4 px-8 w-full max-w-xs"
        onPress={() => router.push("/parent/request-buddi")}
      >
        <Feather name="user-plus" size={20} color="white" />
        <Text className="text-white font-comfortaa-bold text-base ml-2">
          Request a buddi now!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoBuddi;
