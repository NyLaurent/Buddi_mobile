import { authorizedApi } from "./config";
import { getPlatform } from "../../utils/platform";

export interface BackgroundCheckPaymentRequest {
  parentId: string;
  amount: number;
  platform?: 'web' | 'mobile'; // Optional since we'll auto-detect
}

export interface BackgroundCheckPaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  transactionId?: string;
  url?: string; // Stripe checkout URL
}

export interface PaymentVerificationRequest {
  parentId: string;
  sessionId?: string;
  paymentIntentId?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  paymentStatus?: string;
  isBgCheckPaid?: boolean;
}

class PaymentService {
  /**
   * Pay for background check
   * @param data - Payment request data
   * @returns Promise with payment response
   */
  async payBackgroundCheck(data: BackgroundCheckPaymentRequest): Promise<BackgroundCheckPaymentResponse> {
    try {
      // Auto-detect platform and include it in the request
      const requestData = {
        ...data,
        platform: data.platform || getPlatform(),
      };
      
      console.log("[PAYMENT] Initiating background check payment:", requestData);
      
      const response = await authorizedApi.post("/payments/payBgCheckByParent", requestData);
      
      console.log("[PAYMENT] Background check payment successful:", response.data);
      
      return {
        success: true,
        message: response.data.message || "Payment successful",
        paymentId: response.data.paymentId,
        transactionId: response.data.transactionId,
        url: response.data.url, // Include Stripe checkout URL
      };
    } catch (error: any) {
      console.error("[PAYMENT] Background check payment failed:", error);
      
      let errorMessage = "Payment failed. Please try again.";
      
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

  /**
   * Verify payment after Stripe redirect
   * @param data - Payment verification data
   * @returns Promise with verification response
   */
  async verifyPayment(data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    try {
      console.log("[PAYMENT] Verifying payment:", data);
      
      const response = await authorizedApi.post("/payments/verifyPayment", data);
      
      console.log("[PAYMENT] Payment verification successful:", response.data);
      
      return {
        success: true,
        message: response.data.message || "Payment verified successfully",
        paymentStatus: response.data.paymentStatus,
        isBgCheckPaid: response.data.isBgCheckPaid,
      };
    } catch (error: any) {
      console.error("[PAYMENT] Payment verification failed:", error);
      
      let errorMessage = "Payment verification failed. Please try again.";
      
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

export default new PaymentService(); 