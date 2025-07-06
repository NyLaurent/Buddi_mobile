import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireApproval?: boolean;
  redirectTo?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles = [],
  requireApproval = false,
  redirectTo = "/auth/login",
}) => {
  const { user, buddiDetails, parentDetails, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Reset redirect flag when dependencies change
    hasRedirected.current = false;
  }, [user?.userId]);

  useEffect(() => {
    if (isLoading || hasRedirected.current) return;

    // Not authenticated
    if (!user) {
      hasRedirected.current = true;
      router.replace(redirectTo as any);
      return;
    }

    // Check role permission
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      hasRedirected.current = true;
      router.replace("/auth/login");
      return;
    }

    // For parent role, only check basic authentication
    if (user.role === "parent") {
      return;
    }

    // Check approval requirements for buddi (skip for admin roles)
    if (requireApproval && !["admin", "minorAdmin"].includes(user.role)) {
      if (user.role === "buddi" && buddiDetails) {
        if (buddiDetails.status === "RegisterApprovalPending") {
          hasRedirected.current = true;
          router.replace("/auth/waitlist");
          return;
        }
        if (
          buddiDetails.status === "Registered" &&
          !buddiDetails.recordingCompleted
        ) {
          hasRedirected.current = true;
          router.replace("/auth/interview-guidelines");
          return;
        }
      }
    }
  }, [
    user,
    buddiDetails,
    isLoading,
    allowedRoles,
    requireApproval,
    redirectTo,
  ]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FF932E",
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
  }

  // Only check basic authentication for parents
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
};
