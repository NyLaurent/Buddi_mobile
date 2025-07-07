import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { FullScreenLoader } from "../components/commons/FullScreenLoader";
import AuthService from "../services/api/auth.service";
import { STORAGE_KEYS } from "../services/api/config";

// Types for our authentication context
export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  homeAddress: string;
  role: "buddi" | "parent" | "admin" | "minorAdmin" | "referralTeacher";
  createdAt: string;
  updatedAt: string;
}

export interface BuddiDetails {
  id: number;
  status:
    | "RegisterApprovalPending"
    | "Registered"
    | "approved"
    | "verified"
    | "submissionApproved"
    | "referenceApproved";
  totalEarnings: number;
  currentSchool: string;
  AreaOfStudy: string;
  Gpa: string;
  teacherEmail: string;
  teacherPhoneNumber: string;
  customReferral?: string;
  referralOccupation?: string;
  resume?: string;
  gender: string;
  dob: string;
  userId: string;
  profilePicture?: string;
  rating?: number;
  recordingCompleted?: boolean; // Track if recording is completed
}

export interface ParentDetails {
  id: number;
  userId: string;
  childrenCount: number;
  children: {
    name: string;
    age: number;
    school: string;
  }[];
  approvalStage: "pending" | "approved" | "active";
  paymentMethod: string;
  bgcStatus: string;
  cardDetails: any;
  checkrCandidateId: any;
  checkrReportId: any;
}

export interface AuthContextType {
  // State
  user: User | null;
  buddiDetails: BuddiDetails | null;
  parentDetails: ParentDetails | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerBuddi: (data: any) => Promise<void>;
  registerParent: (data: any) => Promise<void>;
  updateBuddiRecordingStatus: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  clearAllStorage: () => Promise<void>; // Temporary for debugging
  startStatusPolling: () => void;
  stopStatusPolling: () => void;

  // Navigation helpers
  getInitialRoute: () => string;
  shouldShowWaitlist: () => boolean;
  canAccessPortal: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [buddiDetails, setBuddiDetails] = useState<BuddiDetails | null>(null);
  const [parentDetails, setParentDetails] = useState<ParentDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const [statusPollInterval, setStatusPollInterval] = useState<any>(null);

  const authService = AuthService;

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    // Don't interfere with navigation during login process or status changes
    if (!isLoading && !isLoggingIn && !statusPollInterval) {
      handleNavigation();
    }
  }, [user, buddiDetails, parentDetails, isLoading, isLoggingIn, segments]);

  // Start/stop status polling based on user authentication and location
  useEffect(() => {
    if (user && !isLoading && !isLoggingIn) {
      // Start polling for users who need status updates
      const needsPolling =
        (user.role === "buddi" &&
          buddiDetails?.status === "RegisterApprovalPending") ||
        (user.role === "parent" && parentDetails?.approvalStage === "pending");

      if (needsPolling) {
        startStatusPolling();
      } else {
        stopStatusPolling();
      }
    } else {
      stopStatusPolling();
    }

    // Cleanup on unmount
    return () => {
      stopStatusPolling();
    };
  }, [user, buddiDetails, parentDetails, isLoading, isLoggingIn]);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const isAuth = await authService.isAuthenticated();
      if (!isAuth) {
        setIsLoading(false);
        return;
      }

      // Load user data from storage
      await loadUserData();
    } catch (error) {
      console.error("Error initializing auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const buddiData = await AsyncStorage.getItem("buddi_details");
      const parentData = await AsyncStorage.getItem("parent_details");

      console.log("loadUserData - Loading from storage...");
      console.log("loadUserData - userData:", userData);
      console.log("loadUserData - parentData:", parentData);

      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (buddiData) {
        setBuddiDetails(JSON.parse(buddiData));
      }
      if (parentData) {
        console.log("loadUserData - Setting parentDetails from storage");
        setParentDetails(JSON.parse(parentData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleNavigation = () => {
    const inAuthGroup = segments[0] === "auth";
    const inProtectedRoute = ["buddi", "parent", "admin"].includes(segments[0]);

    // TEMPORARY: Allow unrestricted access to these routes for development
    // TODO: REMOVE THIS BEFORE PRODUCTION
    const isTemporaryUnprotectedRoute =
      segments[0] === "onboarding" ||
      segments[0] === "role-select" ||
      (inAuthGroup && segments[1] === "signup");

    if (isTemporaryUnprotectedRoute) {
      console.log(
        "handleNavigation - Temporarily allowing access to development routes"
      );
      return;
    }

    const isPublicRoute =
      ["role-select", "onboarding", ""].includes(segments[0]) ||
      segments[0] === undefined;

    // Make login route always accessible
    const isLoginRoute = segments[0] === "auth" && segments[1] === "login";

    // Allow submission-approved page access
    const isSubmissionApprovedRoute =
      inAuthGroup &&
      segments[1] === "submission-approved" &&
      user?.role === "buddi" &&
      buddiDetails?.status === "submissionApproved";

    // Allow recording page access for registered buddis
    const isRecordingFlow =
      inAuthGroup &&
      ["interview-guidelines", "recording"].includes(segments[1]) &&
      user?.role === "buddi" &&
      buddiDetails?.status === "Registered";

    console.log("handleNavigation - Debug Info:", {
      segments,
      inAuthGroup,
      inProtectedRoute,
      isPublicRoute,
      isRecordingFlow,
      isLoginRoute,
      isSubmissionApprovedRoute,
      userRole: user?.role,
      buddiStatus: buddiDetails?.status,
      recordingCompleted: buddiDetails?.recordingCompleted,
      currentPath: segments.join("/"),
    });

    // Always allow access to login route
    if (isLoginRoute) {
      console.log("handleNavigation - Login route is freely accessible");
      return;
    }

    // Allow submission-approved route
    if (isSubmissionApprovedRoute) {
      console.log("handleNavigation - Submission approved route is accessible");
      return;
    }

    // Allow recording flow for registered buddis
    if (isRecordingFlow) {
      console.log("handleNavigation - Recording flow is accessible");
      return;
    }

    if (!user) {
      if (inProtectedRoute) {
        router.replace("/auth/login");
      }
      return;
    }

    // Check if we need to redirect to submission-approved
    if (
      user.role === "buddi" &&
      buddiDetails?.status === "submissionApproved" &&
      (!inAuthGroup || segments[1] !== "submission-approved")
    ) {
      console.log("handleNavigation - Redirecting to submission-approved");
      router.replace("/auth/submission-approved/index" as any);
      return;
    }

    // Allow admin to navigate freely within admin routes
    if (user.role === "admin" || user.role === "minorAdmin") {
      if (segments[0] === "admin") {
        return; // Allow free navigation within admin routes
      }
      if (!inProtectedRoute) {
        router.replace("/admin");
      }
      return;
    }

    // Allow referralTeacher to navigate freely within head-teacher routes
    if (user.role === "referralTeacher") {
      if (segments[0] === "head-teacher") {
        return; // Allow free navigation within head-teacher routes
      }
      // Optionally, redirect to /head-teacher if not in a protected route
      if (!inProtectedRoute) {
        router.replace("/head-teacher");
      }
      return;
    }

    // Allow approved buddis to navigate freely within buddi routes
    if (user.role === "buddi" && buddiDetails) {
      const isApprovedBuddi = [
        "referenceApproved",
        "approved",
        "verified",
      ].includes(buddiDetails.status);
      if (isApprovedBuddi && segments[0] === "buddi") {
        console.log(
          "handleNavigation - Approved buddi navigating freely within buddi portal"
        );
        return; // Allow free navigation within buddi routes
      }
    }

    // Allow approved parents to navigate freely within parent routes
    if (user.role === "parent" && parentDetails) {
      const isApprovedParent = ["approved", "active"].includes(
        parentDetails.approvalStage
      );
      if (isApprovedParent && segments[0] === "parent") {
        console.log(
          "handleNavigation - Approved parent navigating freely within parent portal"
        );
        return; // Allow free navigation within parent routes
      }
    }

    // Handle other roles navigation
    const targetRoute = getInitialRoute();
    if (targetRoute !== `/${segments.join("/")}`) {
      console.log("handleNavigation - Redirecting to:", targetRoute);
      router.replace(targetRoute as any);
    }
  };

  const getInitialRoute = (): string => {
    if (!user) return "/auth/login";

    console.log("getInitialRoute - User role:", user.role);
    console.log("getInitialRoute - BuddiDetails:", buddiDetails);
    console.log("getInitialRoute - ParentDetails:", parentDetails);

    switch (user.role) {
      case "admin":
      case "minorAdmin":
        return "/admin";

      case "buddi":
        if (!buddiDetails) return "/auth/login";

        if (buddiDetails.status === "RegisterApprovalPending") {
          return "/auth/waitlist";
        }

        if (buddiDetails.status === "submissionApproved") {
          return "/auth/submission-approved";
        }

        if (
          buddiDetails.status === "Registered" &&
          !buddiDetails.recordingCompleted
        ) {
          return "/auth/interview-guidelines";
        }

        if (
          buddiDetails.status === "Registered" &&
          buddiDetails.recordingCompleted
        ) {
          return "/auth/login"; // Redirect to login for final authentication
        }

        if (
          ["referenceApproved", "approved", "verified"].includes(
            buddiDetails.status
          )
        ) {
          console.log(
            "getInitialRoute - Approved buddi, returning to buddi portal"
          );
          return "/buddi";
        }

        return "/auth/waitlist";

      case "parent":
        if (!parentDetails) {
          console.log(
            "getInitialRoute - No parentDetails, redirecting to login"
          );
          return "/auth/login";
        }

        console.log(
          "getInitialRoute - Parent approval stage:",
          parentDetails.approvalStage
        );

        if (parentDetails.approvalStage === "pending") {
          console.log(
            "getInitialRoute - Parent pending, redirecting to waitlist"
          );
          return "/auth/waitlist";
        }

        if (["approved", "active"].includes(parentDetails.approvalStage)) {
          console.log(
            "getInitialRoute - Approved parent, returning to parent portal"
          );
          return "/parent";
        }

        return "/auth/waitlist";

      case "referralTeacher":
        return "/head-teacher";

      default:
        return "/auth/login";
    }
  };

  const shouldShowWaitlist = (): boolean => {
    if (!user) return false;

    if (user.role === "buddi" && buddiDetails) {
      return buddiDetails.status === "RegisterApprovalPending";
    }

    if (user.role === "parent" && parentDetails) {
      return parentDetails.approvalStage === "pending";
    }

    return false;
  };

  const canAccessPortal = (): boolean => {
    if (!user) return false;

    if (user.role === "admin" || user.role === "minorAdmin") return true;

    if (user.role === "buddi" && buddiDetails) {
      return ["referenceApproved", "approved", "verified"].includes(
        buddiDetails.status
      );
    }

    if (user.role === "parent" && parentDetails) {
      return ["approved", "active"].includes(parentDetails.approvalStage);
    }

    return false;
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setIsLoggingIn(true);

      // Step 1: Login to get the token
      const loginResponse = await authService.login({ email, password });
      console.log("Login - Step 1: Login successful");

      // Step 2: Get fresh profile data with current status
      console.log("Login - Step 2: Getting fresh profile data...");
      const profileResponse = await authService.getProfile();

      console.log("Login - Profile API response:", profileResponse);

      // Extract user data from profile response
      const apiUser = profileResponse.user;
      const {
        Buddi,
        Parent,
        SuperAdmin,
        MinorAdmin,
        ReferralTeacher,
        ...cleanUser
      } = apiUser;

      console.log("Login - Clean user:", cleanUser);
      console.log("Login - Buddi data:", apiUser.Buddi);
      console.log("Login - Parent data:", apiUser.Parent);

      setUser(cleanUser);

      // Handle role-specific data extraction and storage
      if (cleanUser.role === "buddi" && apiUser.Buddi) {
        const buddiData = apiUser.Buddi;
        console.log("Login - Setting buddi data:", buddiData);
        setBuddiDetails(buddiData);
        await AsyncStorage.setItem("buddi_details", JSON.stringify(buddiData));
      }

      if (cleanUser.role === "parent" && apiUser.Parent) {
        const parentData = apiUser.Parent;
        console.log("Login - Setting parent data:", parentData);
        setParentDetails(parentData);
        await AsyncStorage.setItem(
          "parent_details",
          JSON.stringify(parentData)
        );
      }

      // Store clean user data
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(cleanUser)
      );

      // Step 3: Determine target route based on fresh profile data
      console.log("Login - Step 3: Determining target route...");
      setIsLoading(false);
      setIsLoggingIn(false);

      let targetRoute = "/auth/login";

      if (cleanUser.role === "admin" || cleanUser.role === "minorAdmin") {
        targetRoute = "/admin";
      } else if (cleanUser.role === "referralTeacher") {
        targetRoute = "/head-teacher";
      } else if (cleanUser.role === "buddi") {
        if (apiUser.Buddi) {
          console.log("Login - Buddi status:", apiUser.Buddi.status);
          if (apiUser.Buddi.status === "RegisterApprovalPending") {
            targetRoute = "/auth/waitlist";
          } else if (apiUser.Buddi.status === "submissionApproved") {
            targetRoute = "/auth/submission-approved";
          } else if (
            apiUser.Buddi.status === "Registered" &&
            !apiUser.Buddi.recordingCompleted
          ) {
            targetRoute = "/auth/interview-guidelines";
          } else if (["Approved", "Active"].includes(apiUser.Buddi.status)) {
            targetRoute = "/buddi";
          } else {
            targetRoute = "/auth/waitlist";
          }
        } else {
          console.log("Login - No Buddi data found, redirecting to waitlist");
          targetRoute = "/auth/waitlist";
        }
      } else if (cleanUser.role === "parent") {
        if (apiUser.Parent) {
          console.log(
            "Login - Parent approval stage:",
            apiUser.Parent.approvalStage
          );
          if (apiUser.Parent.approvalStage === "pending") {
            targetRoute = "/auth/waitlist";
          } else if (
            ["approved", "active"].includes(apiUser.Parent.approvalStage)
          ) {
            targetRoute = "/parent";
          } else {
            targetRoute = "/auth/waitlist";
          }
        } else {
          console.log("Login - No Parent data found, redirecting to waitlist");
          targetRoute = "/auth/waitlist";
        }
      }

      console.log("Login - Final target route:", targetRoute);
      router.replace(targetRoute as any);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const registerBuddi = async (data: any): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.registerBuddi(data);

      // Transform API response to match interfaces
      const user = response.user as unknown as User;
      const buddi = response.buddi as unknown as BuddiDetails;

      setUser(user);
      setBuddiDetails(buddi);

      // Store data
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
        ["buddi_details", JSON.stringify(buddi)],
      ]);
    } catch (error) {
      console.error("Buddi registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerParent = async (data: any): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.registerParent(data);

      // Transform API response to match interfaces
      const user = response.user as unknown as User;
      const parent = response.parent as unknown as ParentDetails;

      setUser(user);
      setParentDetails(parent);

      // Store data
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
        ["parent_details", JSON.stringify(parent)],
      ]);
    } catch (error) {
      console.error("Parent registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBuddiRecordingStatus = async (): Promise<void> => {
    if (buddiDetails) {
      const updatedDetails = { ...buddiDetails, recordingCompleted: true };
      setBuddiDetails(updatedDetails);
      await AsyncStorage.setItem(
        "buddi_details",
        JSON.stringify(updatedDetails)
      );
    }
  };

  const refreshUserData = async (): Promise<void> => {
    // TODO: Implement API call to refresh user data
    await loadUserData();
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("AuthContext: Starting logout..."); // Debug log
      setIsLoading(true);

      // Stop status polling
      stopStatusPolling();

      console.log("AuthContext: Calling auth service logout..."); // Debug log
      // Call auth service logout to clear storage
      await authService.logout();

      console.log("AuthContext: Clearing context state..."); // Debug log
      // Clear state
      setUser(null);
      setBuddiDetails(null);
      setParentDetails(null);

      console.log("AuthContext: Logout completed successfully"); // Debug log
    } catch (error) {
      console.error("AuthContext: Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Temporary function to clear all storage - REMOVE AFTER TESTING
  const clearAllStorage = async (): Promise<void> => {
    try {
      console.log("Clearing all storage...");
      await AsyncStorage.clear();
      setUser(null);
      setBuddiDetails(null);
      setParentDetails(null);
      setIsLoading(false);
      console.log("Storage cleared successfully!");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  // Status polling functions for real-time status updates
  const startStatusPolling = () => {
    // Only start polling if user is authenticated and not already polling
    if (user && !statusPollInterval) {
      console.log("Starting status polling...");
      const interval = setInterval(async () => {
        try {
          console.log("Polling status...");
          const profileResponse = await authService.getProfile();
          const apiUser = profileResponse.user;

          // Check for status changes
          if (user.role === "buddi" && apiUser.Buddi) {
            const currentStatus = buddiDetails?.status;
            const newStatus = apiUser.Buddi.status;

            console.log("Status polling - Current status:", {
              currentStatus,
              newStatus,
              userId: user.userId,
              role: user.role,
            });

            if (currentStatus !== newStatus) {
              console.log(
                `Buddi status changed: ${currentStatus} → ${newStatus}`
              );

              // Stop polling before navigation
              stopStatusPolling();

              // Show loader
              setShowLoader(true);

              // Update buddi details
              const updatedBuddiDetails = apiUser.Buddi;
              console.log(
                "Status polling - Updating buddi details:",
                updatedBuddiDetails
              );
              setBuddiDetails(updatedBuddiDetails);
              await AsyncStorage.setItem(
                "buddi_details",
                JSON.stringify(updatedBuddiDetails)
              );

              // Small delay to ensure state is updated
              await new Promise((resolve) => setTimeout(resolve, 100));

              // Determine the target URL based on new status
              let targetUrl = "";
              console.log(
                "Status polling - Processing status change:",
                newStatus
              );

              switch (newStatus) {
                case "submissionApproved":
                  console.log(
                    "Status polling - Status changed to submissionApproved"
                  );
                  targetUrl = "/auth/submission-approved";
                  break;
                case "Registered":
                  console.log(
                    "Status polling - Redirecting to interview-guidelines"
                  );
                  targetUrl = "/auth/interview-guidelines";
                  break;
                case "referenceApproved":
                case "approved":
                case "verified":
                  console.log(
                    "Status polling - Status approved, redirecting to buddi portal"
                  );
                  targetUrl = "/buddi";
                  break;
                default:
                  console.log("Status polling - Redirecting to waitlist");
                  targetUrl = "/auth/waitlist";
              }

              console.log("Status polling - Final target URL:", targetUrl);

              // Update URL using router for proper navigation
              router.replace(targetUrl as any);

              // Small delay to ensure navigation completes
              await new Promise((resolve) => setTimeout(resolve, 500));

              // Refresh the page to ensure clean state
              window.location.reload();
            }
          }

          if (user.role === "parent" && apiUser.Parent) {
            const currentStage = parentDetails?.approvalStage;
            const newStage = apiUser.Parent.approvalStage;

            if (currentStage !== newStage) {
              console.log(
                `Parent approval stage changed: ${currentStage} → ${newStage}`
              );

              // Stop polling before navigation
              stopStatusPolling();

              // Show loader
              setShowLoader(true);

              // Update parent details
              const updatedParentDetails = apiUser.Parent;
              setParentDetails(updatedParentDetails);
              await AsyncStorage.setItem(
                "parent_details",
                JSON.stringify(updatedParentDetails)
              );

              // Small delay to ensure state is updated
              await new Promise((resolve) => setTimeout(resolve, 100));

              // Determine target URL and force reload
              const targetUrl = !["approved", "active"].includes(newStage)
                ? "/auth/waitlist"
                : "/parent";

              // Change URL and force reload
              window.location.href = targetUrl;
              window.location.reload();
            }
          }
        } catch (error) {
          console.error("Status polling error:", error);
        }
      }, 5000); // Poll every 5 seconds

      setStatusPollInterval(interval);
    }
  };

  const stopStatusPolling = () => {
    if (statusPollInterval) {
      console.log("Stopping status polling...");
      clearInterval(statusPollInterval);
      setStatusPollInterval(null);
    }
  };

  const value: AuthContextType = {
    // State
    user,
    buddiDetails,
    parentDetails,
    isLoading,
    isAuthenticated: !!user,

    // Actions
    login,
    logout,
    registerBuddi,
    registerParent,
    updateBuddiRecordingStatus,
    refreshUserData,
    clearAllStorage,
    startStatusPolling,
    stopStatusPolling,

    // Navigation helpers
    getInitialRoute,
    shouldShowWaitlist,
    canAccessPortal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {(isLoading || showLoader) && <FullScreenLoader />}
    </AuthContext.Provider>
  );
};
