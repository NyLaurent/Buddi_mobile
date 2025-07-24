import { useRouter, useSegments } from "expo-router";
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
  const { user, buddiDetails, parentDetails, superAdminDetails, isLoading } =
    useAuth();
  const router = useRouter();
  const segments = useSegments();
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

    // Handle approval requirements based on role
    if (requireApproval) {
      switch (user.role) {
        case "superAdmin":
          // SuperAdmin has full access without approval checks
          break;
        case "buddi":
          if (buddiDetails) {
            // Allow approved buddis to navigate freely within their portal
            const isApprovedBuddi = [
              "referenceApproved",
              "approved",
              "verified",
            ].includes(buddiDetails.status);
            const isInBuddiPortal = segments[0] === "buddi";

            // NEW: Check profile video submission
            if (isApprovedBuddi && isInBuddiPortal) {
              if (buddiDetails.isProfileVideoSubmitted === false) {
                hasRedirected.current = true;
                router.replace("/auth/profile-video");
                return;
              }
              // Allow free navigation within buddi portal for approved users with profile video
              return;
            }

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
          break;
        case "admin":
        case "minorAdmin":
          // Admin roles don't need approval checks
          break;
        case "parent":
          if (parentDetails) {
            // Allow approved parents to navigate freely within their portal
            const isApprovedParent = ["approved", "active"].includes(
              parentDetails.approvalStage
            );
            const isInParentPortal = segments[0] === "parent";

            if (isApprovedParent && isInParentPortal) {
              // Allow free navigation within parent portal for approved users
              return;
            }

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
          break;
        case "referralTeacher":
          // For now, no approval logic, but you can add checks here if needed
          break;
      }
    }
  }, [
    user,
    buddiDetails,
    parentDetails,
    superAdminDetails,
    isLoading,
    allowedRoles,
    requireApproval,
    redirectTo,
    segments,
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

  // Check authentication and role permissions
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
};
