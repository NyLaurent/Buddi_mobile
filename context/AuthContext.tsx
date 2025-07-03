import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
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
  role: "buddi" | "parent" | "admin" | "minorAdmin" | "head-teacher";
  createdAt: string;
  updatedAt: string;
}

export interface BuddiDetails {
  id: number;
  status: "RegisterApprovalPending" | "Registered" | "Approved" | "Active";
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
  const router = useRouter();
  const segments = useSegments();

  const authService = AuthService;

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    // Don't interfere with navigation during login process
    if (!isLoading && !isLoggingIn) {
      handleNavigation();
    }
  }, [user, buddiDetails, parentDetails, isLoading, isLoggingIn, segments]);

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
    const isPublicRoute =
      ["role-select", "onboarding", ""].includes(segments[0]) ||
      segments[0] === undefined;

    console.log("handleNavigation - Current segments:", segments);
    console.log("handleNavigation - User:", user?.role);
    console.log("handleNavigation - inAuthGroup:", inAuthGroup);
    console.log("handleNavigation - isLoading:", isLoading);

    if (!user) {
      // User not logged in
      if (inProtectedRoute) {
        router.replace("/auth/login");
      }
      // Allow navigation to public routes like role-select, onboarding
      if (isPublicRoute) {
        return;
      }
      return;
    }

    // User is logged in - determine correct route
    const targetRoute = getInitialRoute();
    const currentPath = "/" + segments.join("/");

    console.log("handleNavigation - Target route:", targetRoute);
    console.log("handleNavigation - Current path:", currentPath);

    // Don't redirect if already on correct path or on a public route
    if (currentPath === targetRoute || isPublicRoute) {
      console.log("handleNavigation - Already on correct path or public route");
      return;
    }

    // Allow redirects FROM login TO other auth routes (like waitlist)
    // But prevent redirects when already on the target auth route
    if (inAuthGroup && currentPath === targetRoute) {
      console.log("handleNavigation - Already on target auth route, staying");
      return;
    }

    // Redirect to appropriate route
    console.log("handleNavigation - Redirecting to:", targetRoute);
    router.replace(targetRoute as any);
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

        if (["Approved", "Active"].includes(buddiDetails.status)) {
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
          return "/parent";
        }

        return "/auth/waitlist";

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
      return ["Approved", "Active"].includes(buddiDetails.status);
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
      } else if (cleanUser.role === "buddi") {
        if (apiUser.Buddi) {
          console.log("Login - Buddi status:", apiUser.Buddi.status);
          if (apiUser.Buddi.status === "RegisterApprovalPending") {
            targetRoute = "/auth/waitlist";
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

    // Navigation helpers
    getInitialRoute,
    shouldShowWaitlist,
    canAccessPortal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
