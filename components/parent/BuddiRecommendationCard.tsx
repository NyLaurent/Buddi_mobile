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
  onRankBuddi: (buddiId: number, rating: number, comment: string) => void;
  currentRank?: number;
  isRanking?: boolean;
  rankingDate?: string;
  isTopRanked?: boolean;
}

const BuddiRecommendationCard: React.FC<BuddiRecommendationCardProps> = ({
  buddi,
  onSelectBuddy,
  onViewProfile,
  onRankBuddi,
  currentRank,
  isRanking = false,
  rankingDate,
  isTopRanked = false,
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
        backgroundColor: isTopRanked ? "#FFF7ED" : "#fff",
        borderWidth: isTopRanked ? 2 : 1,
        borderColor: isTopRanked ? "#FF932E" : "#E5E7EB",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: isTopRanked ? "#FF932E" : "#000",
        shadowOffset: { width: 0, height: isTopRanked ? 4 : 2 },
        shadowOpacity: isTopRanked ? 0.15 : 0.1,
        shadowRadius: isTopRanked ? 8 : 4,
        elevation: isTopRanked ? 6 : 2,
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
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          {isTopRanked && (
            <FontAwesome5
              name="crown"
              size={16}
              color="#FF932E"
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 18,
              color: isTopRanked ? "#FF932E" : "#1F2937",
            }}
          >
            {buddi.User?.firstName} {buddi.User?.lastName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {isTopRanked && (
            <View
              style={{
                backgroundColor: "#FF932E",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 10,
                  color: "#fff",
                }}
              >
                TOP RANKED
              </Text>
            </View>
          )}
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
                <FontAwesome5 name="user-circle" size={32} color="#9CA3AF" />
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

      {/* Ranking Section */}
      {isRanking && (
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 14,
              color: "#1F2937",
              marginBottom: 8,
            }}
          >
            Rank this Buddy
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
            {[1, 2, 3].map((rank) => (
              <TouchableOpacity
                key={rank}
                style={{
                  flex: 1,
                  backgroundColor: currentRank === rank ? "#FF932E" : "#F3F4F6",
                  paddingVertical: 8,
                  borderRadius: 6,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: currentRank === rank ? "#FF932E" : "#E5E7EB",
                }}
                onPress={() =>
                  onRankBuddi(
                    buddi.id,
                    rank,
                    `Ranked as ${
                      rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"
                    } choice`
                  )
                }
              >
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 14,
                    color: currentRank === rank ? "#fff" : "#6B7280",
                  }}
                >
                  {rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {currentRank && (
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
                color: "#22C55E",
                textAlign: "center",
              }}
            >
              ✓ Ranked as{" "}
              {currentRank === 1 ? "1st" : currentRank === 2 ? "2nd" : "3rd"}{" "}
              choice
            </Text>
          )}
        </View>
      )}

      {/* Show Current Ranking (when not in ranking mode) */}
      {!isRanking && currentRank && (
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: "#F0F9FF",
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#0EA5E9",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                  color: "#0EA5E9",
                  marginRight: 8,
                }}
              >
                {currentRank === 1 ? "🥇" : currentRank === 2 ? "🥈" : "🥉"}
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 14,
                  color: "#0EA5E9",
                }}
              >
                Your{" "}
                {currentRank === 1 ? "1st" : currentRank === 2 ? "2nd" : "3rd"}{" "}
                Choice
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
                color: "#0369A1",
                textAlign: "center",
              }}
            >
              {currentRank === 1
                ? "This buddy will be automatically assigned to your call"
                : "Backup choice in case 1st choice is unavailable"}
            </Text>
            {rankingDate && (
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 10,
                  color: "#0369A1",
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                Ranked on {new Date(rankingDate).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: isTopRanked ? "#FF932E" : "#E5E7EB",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
            opacity: isTopRanked ? 1 : 0.6,
          }}
          onPress={() => isTopRanked && onSelectBuddy(buddi.id)}
          disabled={!isTopRanked}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 14,
              color: isTopRanked ? "#fff" : "#9CA3AF",
            }}
          >
            Match Buddy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: isTopRanked ? "#F3F4F6" : "#FF932E",
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
              color: isTopRanked ? "#6B7280" : "#fff",
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
