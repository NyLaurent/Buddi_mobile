import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface BuddiRecommendationCardProps {
  buddi: {
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
    isInterviewVideoSubmitted: boolean;
    totalEarnings: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    User?: {
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
  };
  onSelectBuddy: (buddiId: number) => void;
  onViewProfile: (buddiId: number) => void;
}

const BuddiRecommendationCard: React.FC<BuddiRecommendationCardProps> = ({
  buddi,
  onSelectBuddy,
  onViewProfile,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#22C55E";
      case "referenceApproved":
        return "#3B82F6";
      case "pending":
        return "#FF932E";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "referenceApproved":
        return "Reference Approved";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}
    >
      {/* Header with Status */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 18,
            color: "#1F2937",
          }}
        >
          {buddi.User?.firstName} {buddi.User?.lastName}
        </Text>
        <View
          style={{
            backgroundColor: getStatusColor(buddi.status) + "20",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Medium",
              fontSize: 12,
              color: getStatusColor(buddi.status),
            }}
          >
            {getStatusText(buddi.status)}
          </Text>
        </View>
      </View>

      {/* Contact Info */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          {/* Profile Picture */}
          <View style={{ marginRight: 16 }}>
            {buddi.profilePicture ? (
              <Image
                source={{ uri: buddi.profilePicture }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth: 2,
                  borderColor: "#E5E7EB",
                }}
              />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#F4F7FE",
                  borderWidth: 2,
                  borderColor: "#E5E7EB",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome5 
                  name="user-circle" 
                  size={32} 
                  color="#9CA3AF" 
                />
              </View>
            )}
          </View>

          {/* Contact Info */}
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Ionicons name="mail" size={16} color="#6B7280" />
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 14,
                  color: "#6B7280",
                  marginLeft: 8,
                }}
              >
                {buddi.User?.email}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Ionicons name="call" size={16} color="#6B7280" />
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 14,
                  color: "#6B7280",
                  marginLeft: 8,
                }}
              >
                {buddi.User?.phoneNumber}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Academic Info */}
      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 14,
            color: "#1F2937",
            marginBottom: 8,
          }}
        >
          Academic Information
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <FontAwesome5 name="university" size={16} color="#3B82F6" />
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
              color: "#6B7280",
              marginLeft: 8,
            }}
          >
            {buddi.currentSchool}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <FontAwesome5 name="book" size={16} color="#22C55E" />
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
              color: "#6B7280",
              marginLeft: 8,
            }}
          >
            {buddi.AreaOfStudy}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name="star" size={16} color="#FFD700" />
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
              color: "#6B7280",
              marginLeft: 8,
            }}
          >
            GPA: {buddi.Gpa}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#FF932E",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => onSelectBuddy(buddi.id)}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 14,
              color: "#fff",
            }}
          >
            Select Buddy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#F3F4F6",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => onViewProfile(buddi.id)}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 14,
              color: "#6B7280",
            }}
          >
            View Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BuddiRecommendationCard;
