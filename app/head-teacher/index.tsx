import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function HeadTeacherDashboard() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#fff" }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 24,
          color: "#FF932E",
          fontFamily: "Comfortaa-Bold",
        }}
      >
        Welcome, Head Teacher!
      </Text>
      <TouchableOpacity
        style={{
          padding: 18,
          backgroundColor: "#FF932E",
          borderRadius: 16,
          marginBottom: 16,
        }}
        onPress={() => router.push("/head-teacher/students")}
      >
        <Text
          style={{ color: "#fff", fontSize: 16, fontFamily: "Comfortaa-Bold" }}
        >
          View Students
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 18,
          backgroundColor: "#FF932E",
          borderRadius: 16,
          marginBottom: 16,
        }}
        onPress={() => router.push("/head-teacher/requests")}
      >
        <Text
          style={{ color: "#fff", fontSize: 16, fontFamily: "Comfortaa-Bold" }}
        >
          View Requests
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 18,
          backgroundColor: "#FF932E",
          borderRadius: 16,
          marginBottom: 16,
        }}
        onPress={() => router.push("/head-teacher/school")}
      >
        <Text
          style={{ color: "#fff", fontSize: 16, fontFamily: "Comfortaa-Bold" }}
        >
          School Info
        </Text>
      </TouchableOpacity>
    </View>
  );
}
