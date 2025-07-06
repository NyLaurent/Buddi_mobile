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
  const { user, buddiDetails, parentDetails, isLoading, canAccessPortal } =
    useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Reset redirect flag when dependencies change
    hasRedirected.current = false;
  }, [user?.userId, buddiDetails?.status, parentDetails?.approvalStage]);

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

    // Check approval requirements for buddi and parent (skip for admin roles)
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
        if (buddiDetails.status === "submissionApproved") {
          hasRedirected.current = true;
          router.replace("/auth/submission-approved");
          return;
        }
        if (!["referenceApproved", "approved", "verified"].includes(buddiDetails.status)) {
          hasRedirected.current = true;
          router.replace("/auth/waitlist");
          return;
        }
      }

      if (user.role === "parent" && parentDetails) {
        if (parentDetails.approvalStage === "pending") {
          hasRedirected.current = true;
          router.replace("/auth/waitlist");
          return;
        }
        if (!["approved", "active"].includes(parentDetails.approvalStage)) {
          hasRedirected.current = true;
          router.replace("/auth/waitlist");
          return;
        }
      }
    }
  }, [
    user,
    buddiDetails,
    parentDetails,
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

  // Don't render if user doesn't meet requirements
  if (
    !user ||
    (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) ||
    (requireApproval &&
      !canAccessPortal() &&
      !["admin", "minorAdmin"].includes(user.role))
  ) {
    return null;
  }

  return <>{children}</>;
};
