import { authorizedApi } from "./config";

export interface BackgroundCheckRequest {
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface BackgroundCheckResponse {
  success: boolean;
  message: string;
  checkId?: string;
  status?: string;
  invitationUrl?: string;
}

class BackgroundCheckService {
  /**
   * Submit background check information
   * @param parentId - Parent ID
   * @param data - Background check data
   * @returns Promise with background check response
   */
  async submitBackgroundCheck(parentId: string, data: BackgroundCheckRequest): Promise<BackgroundCheckResponse> {
    try {
      console.log("[BG-CHECK] Submitting background check:", { parentId, data });
      
      const response = await authorizedApi.post(`/bg-check/parent/bg-test/${parentId}`, data);
      
      console.log("[BG-CHECK] Background check submission successful:", response.data);
      
      return {
        success: true,
        message: response.data.message || "Background check submitted successfully",
        checkId: response.data.checkId,
        status: response.data.status,
        invitationUrl: response.data.invitationUrl,
      };
    } catch (error: any) {
      console.error("[BG-CHECK] Background check submission failed:", error);
      
      let errorMessage = "Background check submission failed. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        if (error.message.includes("Network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}

export default new BackgroundCheckService(); 