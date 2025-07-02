import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";
import { RouteGuard } from "../../components/commons/RouteGuard";

const BuddiLayout = () => {
  return (
    <RouteGuard allowedRoles={["buddi"]} requireApproval={true}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* You can add a shared header or nav here if needed */}
        <Slot />
      </View>
    </RouteGuard>
  );
};

export default BuddiLayout;
