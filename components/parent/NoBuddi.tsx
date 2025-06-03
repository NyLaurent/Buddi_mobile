import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const NoBuddi = () => {
  return (
    <View className="flex-1 items-center justify-center px-6 py-10 bg-white">
      {/* Placeholder for the image */}
      <Image
        source={require("../../assets/images/parent/no-buddi.png")} // Replace with your image path
        className="w-32 h-32 mb-6"
        resizeMode="contain"
      />
      <Text className="text-center text-gray-500 font-comfortaa mb-8 text-base">
        You currently have no Buddi!
      </Text>
      <TouchableOpacity className="bg-primary flex-row items-center justify-center rounded-full py-4 px-8 w-full max-w-xs">
        <Feather name="user-plus" size={20} color="white" />
        <Text className="text-white font-comfortaa-bold text-base ml-2">
          Request a buddi now!
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoBuddi;