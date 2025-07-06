import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export const FullScreenLoader = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF932E",
        zIndex: 9999,
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
      <Text
        style={{
          color: "#fff",
          marginTop: 10,
          fontFamily: "Comfortaa-Medium",
        }}
      >
        Loading...
      </Text>
    </View>
  );
}; 