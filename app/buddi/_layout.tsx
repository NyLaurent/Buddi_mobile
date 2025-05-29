import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";

const BuddiLayout = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* You can add a shared header or nav here if needed */}
      <Slot />
    </View>
  );
};

export default BuddiLayout;
