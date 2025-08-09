import { authorizedApi } from './config';
import { BUDDI_ENDPOINTS } from './endpoints';

export interface Buddi {
  id: string;
  name: string;
  email: string;
  totalJobs: number;
  currentStatus: string;
  rating: number | null;
  status?: string;
  AreaOfStudy?: string;
  currentSchool?: string;
  User?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export interface BuddiDetails {
  id: number;
  currentSchool: string;
  AreaOfStudy: string;
  Gpa: string;
  status: string;
  teacherEmail: string;
  dob: string;
  gender: string;
  teacherPhoneNumber: string;
  customReferral: string;
  referralOccupation: string;
  resume: string;
  profilePicture: string | null;
  rating: number | null;
  isInterviewVideoSubmitted?: boolean;
  isProfileVideoSubmitted?: boolean;
  totalEarnings: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  User: {
    userId: string;
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    homeAddress: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  Videos: any[];
}

export interface BuddiListResponse {
  data: Buddi[];
  total: number;
}

export interface AvailableCall {
  id: number;
  parentId: string;
  childId: string;
  description: string;
  availableDays: string[];
  callPickupTime: string | null;
  callDropTime: string | null;
  pickupTime: string;
  kidsCount: number;
  fromZone: string;
  toZone: string;
  status: string;
  matchedBuddiId: number | null;
  isBuddiRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableCallsResponse {
  message: string;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  data: AvailableCall[];
}

export interface CallDetailsResponse {
  message: string;
  data: AvailableCall;
}

export interface ApplyForCallRequest {
  buddiRequestId: number;
  buddiId: number;
  message: string;
}

/**
 * Start a trip (clock in) as a Buddi
 * @param payload - { buddiId, buddiRequestId, ... }
 */
async function startTrip(payload: {
  buddiId: number;
  buddiRequestId: number;
  // Add other fields if required by backend
}): Promise<any> {
  const response = await authorizedApi.post("/buddi/start-trip", payload);
  return response.data;
}

/**
 * Buddi starts a pickup trip
 * @param pickupId - the ID of the pickup to start
 */
async function startPickupTrip(pickupId: number | string): Promise<any> {
  console.log("[BUDDI SERVICE] Starting pickup trip:", {
    pickupId,
    endpoint: `/pickups/${pickupId}/start`,
    method: 'PATCH'
  });
  
  const response = await authorizedApi.patch(`/pickups/${pickupId}/start`);
  console.log("[BUDDI SERVICE] Start trip response:", response.data);
  return response.data;
}

/**
 * Buddi completes a pickup trip
 * @param pickupId - the ID of the pickup to complete
 * @param pickupTime - the time the trip started (optional)
 */
async function completePickupTrip(
  pickupId: number | string,
  pickupTime?: string | null
): Promise<any> {
  const now = new Date().toISOString();
  const response = await authorizedApi.patch(`/pickups/${pickupId}/complete`, {
    pickupTime: pickupTime || now,
    dropoffTime: now,
  });
  return response.data;
}

/**
 * Buddi marks the child as picked up
 * @param pickupId - the ID of the pickup
 */
async function pickUpChild(pickupId: number | string): Promise<any> {
  const response = await authorizedApi.patch(`/pickups/${pickupId}/pickup`);
  return response.data;
}

export async function getRandomInterviewQuestions() {
  const res = await authorizedApi.get("/admin/interview-questions");
  const allQuestions = res.data.data;
  // Shuffle and pick 3 random questions
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map((q: any) => ({ id: q.id, questionDescription: q.questionDescription }));
}

/**
 * Get video file info for debugging
 * @param videoUri - Path to the video file
 * @returns Promise<object> - Video file information
 */
export async function getVideoInfo(videoUri: string): Promise<any> {
  try {
    console.log("=== VIDEO INFO START ===");
    console.log("[VIDEO INFO] Video URI:", videoUri);
    console.log("[VIDEO INFO] Video URI type:", typeof videoUri);
    console.log("[VIDEO INFO] Video URI length:", videoUri.length);
    
    // Check if video URI is valid
    if (!videoUri || videoUri.trim() === '') {
      console.error("[VIDEO INFO] Invalid video URI provided");
      throw new Error("Invalid video URI");
    }
    
    // For Expo Go, we can't get detailed file info, but we can log what we have
    console.log("[VIDEO INFO] Video URI appears valid");
    console.log("=== VIDEO INFO END ===");
    
    return {
      uri: videoUri,
      size: 'unknown',
      duration: 'unknown',
      format: 'mp4'
    };
  } catch (error) {
    console.error("=== VIDEO INFO ERROR ===");
    console.error("[VIDEO INFO] Error getting video info:", error);
    console.error("=== VIDEO INFO ERROR END ===");
    return { uri: videoUri, error: 'Failed to get video info' };
  }
}

export async function uploadBuddiProfileVideo(buddiId: number, videoUri: string) {
  try {
    console.log("=== VIDEO UPLOAD START ===");
    console.log("[UPLOAD] Buddi ID:", buddiId);
    console.log("[UPLOAD] Original Video URI:", videoUri);
    console.log("[UPLOAD] Original URI type:", typeof videoUri);
    console.log("[UPLOAD] Original URI length:", videoUri.length);

    // Get video info for debugging (no compression in Expo Go)
    console.log("[UPLOAD] Getting video info...");
    const videoInfo = await getVideoInfo(videoUri);
    console.log("[UPLOAD] Video info:", videoInfo);

    // Create FormData with proper file object
    console.log("[UPLOAD] Creating FormData...");
    const formData = new FormData();
    
    // Extract filename from URI or use default
    const fileName = videoUri.split('/').pop() || 'interview-video.mp4';
    console.log("[UPLOAD] Extracted filename:", fileName);
    
    const fileObj = {
      uri: videoUri,
      name: fileName,
      type: 'video/mp4',
    } as any;

    console.log("[UPLOAD] File object created:", fileObj);
    formData.append('file', fileObj);
    console.log("[UPLOAD] FormData created with file key (matching Postman)");
    console.log("[UPLOAD] FormData created successfully");
    console.log("[UPLOAD] FormData key: 'file' (matches Postman implementation)");

    const url = `/buddi/interview/${buddiId}/uploadBuddiInterviewVideo/video`;
    console.log("[UPLOAD] Making POST request to:", url);
    console.log("[UPLOAD] Making POST request...");

    const uploadStartTime = Date.now();
    const response = await authorizedApi.post(url, formData, {
      timeout: 120000, // 2 minutes timeout for video upload
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          // Ensure progress doesn't exceed 100% due to network overhead
          const percentCompleted = Math.min(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
            100
          );
          const uploadedMB = (progressEvent.loaded / (1024 * 1024)).toFixed(2);
          const totalMB = (progressEvent.total / (1024 * 1024)).toFixed(2);
          console.log(`[UPLOAD] Progress: ${percentCompleted}% (${uploadedMB}MB / ${totalMB}MB)`);
        } else {
          console.log(`[UPLOAD] Progress: ${progressEvent.loaded} bytes uploaded`);
        }
      },
    });
    const uploadEndTime = Date.now();

    console.log("[UPLOAD] Upload completed in:", uploadEndTime - uploadStartTime, "ms");
    console.log("[UPLOAD] Response status:", response.status);
    console.log("[UPLOAD] Response headers:", response.headers);
    console.log("[UPLOAD] Success response data:", response.data);
    console.log("=== VIDEO UPLOAD END ===");
    return response.data;

  } catch (error: any) {
    console.error("=== VIDEO UPLOAD ERROR ===");
    console.error("[UPLOAD] Upload failed with error:", error);
    console.error("[UPLOAD] Error type:", typeof error);
    console.error("[UPLOAD] Error message:", error?.message);
    console.error("[UPLOAD] Error stack:", error?.stack);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      console.error("[UPLOAD] Server error details:");
      console.error("[UPLOAD] - Status:", error.response.status);
      console.error("[UPLOAD] - Status text:", error.response.statusText);
      console.error("[UPLOAD] - Headers:", error.response.headers);
      console.error("[UPLOAD] - Data:", error.response.data);
      console.error("[UPLOAD] - Config:", error.response.config);
      throw new Error(`Upload failed: ${error.response.data?.message || 'Server error'}`);
    } else if (error.request) {
      // Network error
      console.error("[UPLOAD] Network error details:");
      console.error("[UPLOAD] - Request:", error.request);
      console.error("[UPLOAD] - Request readyState:", error.request?.readyState);
      console.error("[UPLOAD] - Request status:", error.request?.status);
      console.error("[UPLOAD] - Request response:", error.request?.response);
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      console.error("[UPLOAD] Other error details:");
      console.error("[UPLOAD] - Message:", error.message);
      console.error("[UPLOAD] - Code:", error.code);
      console.error("[UPLOAD] - Name:", error.name);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}

export async function uploadBuddiProfileIntroVideo(buddiId: number, videoUri: string) {
  try {
    console.log("[UPLOAD PROFILE] Starting profile video upload for buddi:", buddiId);
    console.log("[UPLOAD PROFILE] Original Video URI:", videoUri);

    // Get video info for debugging (no compression in Expo Go)
    console.log("[UPLOAD PROFILE] Getting video info...");
    const videoInfo = await getVideoInfo(videoUri);
    console.log("[UPLOAD PROFILE] Video info:", videoInfo);

    const formData = new FormData();
    const fileObj = {
      uri: videoUri,
      name: "profile-video.mp4",
      type: "video/mp4"
    } as any;
    formData.append("file", fileObj);
    
    const url = `/buddi/profile/${buddiId}/uploadBuddiProfileVideo/video`;
    const res = await authorizedApi.post(url, formData);
    return res.data;
  } catch (err: any) {
    if (err?.response) {
      console.log("[UPLOAD PROFILE VIDEO] Error response:", err.response.data);
    } else {
      console.log("[UPLOAD PROFILE VIDEO] Error:", err);
    }
    throw err;
  }
}

const BuddiService = {
  async getMatchedRequests(buddiId: number): Promise<AvailableCallsResponse> {
    try {
      const response = await authorizedApi.get(`/buddi/${buddiId}/matched-requests`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch matched requests.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async createCoverageRequest(
    parentId: string,
    buddiId: string,
    reason: string
  ): Promise<any> {
    try {
      const response = await authorizedApi.post(
        "/api/v1/coverage/coverage-requests/buddi",
        {
          parentId,
          buddiId,
          reason,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create coverage request");
    }
  },

  async getCoverageRequests(
    buddiId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any> {
    try {
      const response = await authorizedApi.get(
        `/api/v1/coverage/coverage-requests/buddi/${buddiId}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch coverage requests");
    }
  },

  async getAvailableCalls(page: number = 1, limit: number = 5): Promise<AvailableCallsResponse> {
    try {
      const response = await authorizedApi.get(`/parent/requests/all?page=${page}&limit=${limit}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch available calls.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getCallDetails(callId: number): Promise<CallDetailsResponse> {
    try {
      const response = await authorizedApi.get(`/coverage/buddi-request/${callId}`);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch call details.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async applyForCall(request: ApplyForCallRequest): Promise<void> {
    try {
      await authorizedApi.post('/application/apply', request);
    } catch (err: any) {
      // Handle specific HTTP status codes for better user experience
      if (err?.response?.status === 409) {
        throw new Error('ALREADY_APPLIED');
      }
      
      // Handle other common HTTP status codes
      if (err?.response?.status === 400) {
        throw new Error('INVALID_REQUEST');
      }
      
      if (err?.response?.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      
      if (err?.response?.status === 403) {
        throw new Error('FORBIDDEN');
      }
      
      if (err?.response?.status === 404) {
        throw new Error('CALL_NOT_FOUND');
      }
      
      if (err?.response?.status === 422) {
        throw new Error('VALIDATION_ERROR');
      }
      
      if (err?.response?.status >= 500) {
        throw new Error('SERVER_ERROR');
      }
      
      // Handle network and connection errors
      if (err?.message) {
        if (err.message.includes('Network') || err.message.includes('network')) {
          throw new Error('NETWORK_ERROR');
        } else if (err.message.includes('timeout') || err.message.includes('Timeout')) {
          throw new Error('TIMEOUT_ERROR');
        } else if (err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
          throw new Error('CONNECTION_ERROR');
        }
      }
      
      // Handle generic errors
      let message = 'Failed to submit application.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getBuddiesByStatus(status: string, page: number, limit: number): Promise<BuddiListResponse> {
    try {
      const response = await authorizedApi.get(BUDDI_ENDPOINTS.BY_STATUS(status, page, limit));
      // If API returns { data: Buddi[], total: number }
      if (Array.isArray(response.data.data)) {
        return { data: response.data.data, total: response.data.total ?? response.data.data.length };
      }
      // If API returns array directly
      if (Array.isArray(response.data)) {
        return { data: response.data, total: response.data.length };
      }
      return { data: [], total: 0 };
    } catch (err: any) {
      let message = 'Failed to fetch buddies.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },
  async approveBuddi(id: string, currentStatus: string, reason?: string): Promise<void> {
    // Determine the next status based on current status
    const getNextStatus = (status: string) => {
      switch (status) {
        case "RegisterApprovalPending":
          return "Registered";
        case "Registered":
          return "submissionApproved";
        case "submissionApproved":
          return "referenceApproved";
        case "referenceApproved":
          return "verified";
        case "verified":
          return "approved";
        default:
          return "approved";
      }
    };

    const nextStatus = getNextStatus(currentStatus);
    await authorizedApi.put(`/buddi/buddies/${id}/status`, { 
      status: nextStatus, 
      reason: reason || `Advanced to ${nextStatus} by admin` 
    });
  },
  async rejectBuddi(id: string, reason?: string): Promise<void> {
    await authorizedApi.put(`/buddi/buddies/${id}/status`, { 
      status: "rejected", 
      reason: reason || "Rejected by admin" 
    });
  },
  async updateStatus(id: string, status: string, reason: string): Promise<void> {
    await authorizedApi.put(BUDDI_ENDPOINTS.STATUS_UPDATE(id), { status, reason });
  },

  async getBuddiInfo(buddiId: string): Promise<{ message: string; data: BuddiDetails }> {
    try {
      const response = await authorizedApi.get(`/buddi/single/${buddiId}`);
      console.log("[BUDDI SERVICE] Raw API response:", response.data);
      // The API returns the data directly, not wrapped in a data property
      return { message: "Success", data: response.data };
    } catch (err: any) {
      let message = 'Failed to fetch buddi information.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },

  async getWeeklyPickupSummary(buddiId: number): Promise<any> {
    try {
      const response = await authorizedApi.patch(`/buddi/${buddiId}/getWeeklyPickupSummary`);
      console.log("[BUDDI SERVICE] Weekly pickup summary response:", response.data);
      return response.data;
    } catch (err: any) {
      let message = 'Failed to fetch weekly pickup summary.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes('Network')) {
          message = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('timeout')) {
          message = 'Request timed out. Please try again.';
        } else {
          message = err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }
      throw new Error(message);
    }
  },
  startTrip,
  startPickupTrip,
  completePickupTrip,
  pickUpChild,
};

export default BuddiService; 