import React from "react";
import { Platform, ScrollView, View } from "react-native";

const payments = () => {
  return (
    <>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Platform.OS === "android" ? 32 : 0,
          backgroundColor: "white",
          zIndex: 10,
        }}
      />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingTop: Platform.OS === "android" ? 32 : 0,
          minHeight: "100%",
        }}
      ></ScrollView>
    </>
  );
};

export default payments;
