import React from "react";
import { Text, View } from "react-native";
import { RouteGuard } from "../../components/commons/RouteGuard";

export default function HeadTeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["referralTeacher"]}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ padding: 20, backgroundColor: "#FF932E" }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "bold",
              fontFamily: "Comfortaa-Bold",
            }}
          >
            Head Teacher Portal
          </Text>
        </View>
        <View style={{ flex: 1 }}>{children}</View>
      </View>
    </RouteGuard>
  );
}
