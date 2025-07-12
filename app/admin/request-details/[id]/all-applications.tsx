import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../context/AuthContext";
import BuddiService from "../../../../services/api/buddi.service";
import ParentService, {
  Application,
} from "../../../../services/api/parent.service";

export default function AllApplicationsPage() {
  const { id: requestId, parentId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [buddiEmails, setBuddiEmails] = useState<{ [buddiId: string]: string }>(
    {}
  );
  const [emailLoading, setEmailLoading] = useState<{
    [buddiId: string]: boolean;
  }>({});
  const [selectedBuddis, setSelectedBuddis] = useState<number[]>([]);
  const [proposeModalVisible, setProposeModalVisible] = useState(false);
  const [proposeReason, setProposeReason] = useState("");
  const [proposeLoading, setProposeLoading] = useState(false);

  // Replace with actual admin user/email if available
  const recommendedBy = "admin";

  useEffect(() => {
    fetchApplications(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, currentPage]);

  const fetchApplications = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ParentService.getRequestApplications(
        Number(requestId),
        page,
        5
      );
      setApplications(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setTotalApplications(response.pagination.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Buddi email if not present in application
  const fetchBuddiEmail = async (buddiId: number) => {
    setEmailLoading((prev) => ({ ...prev, [buddiId]: true }));
    try {
      const response = await BuddiService.getBuddiInfo(buddiId.toString());
      const email = response.data.User?.email || "N/A";
      setBuddiEmails((prev) => ({ ...prev, [buddiId]: email }));
    } catch {
      setBuddiEmails((prev) => ({ ...prev, [buddiId]: "N/A" }));
    } finally {
      setEmailLoading((prev) => ({ ...prev, [buddiId]: false }));
    }
  };

  const getBuddiName = (application: Application) => {
    if (application.Buddi?.User) {
      return `${application.Buddi.User.firstName} ${application.Buddi.User.lastName}`;
    }
    return `Buddi ${application.buddiId}`;
  };

  const getBuddiEmail = (application: Application) => {
    if (application.Buddi?.User?.email) return application.Buddi.User.email;
    const cached = buddiEmails[application.buddiId];
    if (cached) return cached;
    if (!emailLoading[application.buddiId])
      fetchBuddiEmail(application.buddiId);
    return "Loading...";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Selection logic
  const isSelected = (buddiId: number) => selectedBuddis.includes(buddiId);
  const toggleSelect = (buddiId: number) => {
    setSelectedBuddis((prev) => {
      if (prev.includes(buddiId)) {
        return prev.filter((id) => id !== buddiId);
      } else if (prev.length < 3) {
        return [...prev, buddiId];
      } else {
        return prev;
      }
    });
  };

  // Propose logic
  const handlePropose = async () => {
    if (!parentId) {
      Alert.alert("Error", "Parent ID is missing. Please try again.");
      return;
    }

    setProposeLoading(true);
    try {
      console.log("Proposing buddis with data:", {
        parentId: String(parentId),
        buddiIds: selectedBuddis.map((id) => id.toString()),
        recommendedBy: user?.userId || "",
        reason: proposeReason.trim(),
      });

      await ParentService.proposeBuddiRecommendations({
        parentId: String(parentId),
        callId: String(requestId), // Add the call/request ID
        buddiIds: selectedBuddis.map((id) => id.toString()), // convert numbers to strings as API expects
        recommendedBy: user?.userId || "", // use admin user's userId
        reason: proposeReason.trim(), // trim whitespace
      });
      setProposeModalVisible(false);
      setSelectedBuddis([]);
      setProposeReason("");
      Alert.alert("Success", "Buddis proposed successfully!");
    } catch (err: any) {
      let message = "Failed to propose buddis.";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes("Network")) {
          message =
            "Network error. Please check your connection and try again.";
        } else if (err.message.includes("timeout")) {
          message = "Request timed out. Please try again.";
        } else if (err.message.includes("400")) {
          message = "Invalid request. Please check your input.";
        } else if (err.message.includes("401")) {
          message = "You are not authorized to perform this action.";
        } else if (err.message.includes("403")) {
          message = "You do not have permission to propose buddis.";
        } else if (err.message.includes("404")) {
          message = "API endpoint not found. Please contact support.";
        } else if (err.message.includes("422")) {
          message = "Validation error. Please check your input.";
        } else if (err.message.includes("500")) {
          message = "Server error. Please try again later.";
        } else {
          message = err.message;
        }
      } else if (typeof err === "string") {
        message = err;
      }
      Alert.alert("Error", message);
    } finally {
      setProposeLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Back Button Top Left */}
        <View
          style={{
            paddingTop: 24,
            paddingLeft: 16,
            paddingBottom: 0,
            alignItems: "flex-start",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              paddingHorizontal: 18,
              paddingVertical: 8,
              shadowColor: "#23272F",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
              borderWidth: 1,
              borderColor: "#e9ecef",
            }}
          >
            <Text
              style={{
                color: "#23272F",
                fontFamily: "Comfortaa-Bold",
                fontSize: 15,
              }}
            >
              ← Back
            </Text>
          </TouchableOpacity>
        </View>
        {/* CTA Card */}
        <View
          style={{
            backgroundColor: "#FFF7ED",
            borderRadius: 14,
            marginHorizontal: 24,
            marginTop: 10,
            marginBottom: 18,
            padding: 18,
            borderWidth: 1,
            borderColor: "#FFE0B2",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 15,
              color: "#B26A00",
              marginBottom: 8,
            }}
          >
            First, review all the buddis and their info before proposing them.
            Select up to 3 buddis to propose for this parent call.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor:
                selectedBuddis.length === 3 ? "#34C759" : "#FF932E",
              paddingHorizontal: 22,
              paddingVertical: 12,
              borderRadius: 12,
              shadowColor: "#FF932E",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 2,
              opacity: selectedBuddis.length === 3 ? 1 : 0.5,
              alignSelf: "stretch",
            }}
            disabled={selectedBuddis.length !== 3}
            onPress={() => setProposeModalVisible(true)}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Propose Selected
            </Text>
          </TouchableOpacity>
        </View>
        {/* Propose Modal */}
        <Modal
          visible={proposeModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setProposeModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.18)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 28,
                width: 340,
                maxWidth: "90%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#23272F",
                  marginBottom: 12,
                }}
              >
                Propose 3 Buddis
              </Text>
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 15,
                  color: "#666",
                  marginBottom: 18,
                  textAlign: "center",
                }}
              >
                Please provide a reason for your recommendation.
              </Text>
              <TextInput
                style={{
                  width: "100%",
                  minHeight: 80,
                  borderWidth: 1,
                  borderColor: "#e9ecef",
                  borderRadius: 10,
                  padding: 12,
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 15,
                  color: "#23272F",
                  marginBottom: 18,
                  textAlignVertical: "top",
                }}
                placeholder="Enter reason..."
                value={proposeReason}
                onChangeText={setProposeReason}
                multiline
                numberOfLines={4}
              />
              <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#e9ecef",
                    borderRadius: 10,
                    paddingHorizontal: 22,
                    paddingVertical: 10,
                  }}
                  onPress={() => setProposeModalVisible(false)}
                  disabled={proposeLoading}
                >
                  <Text
                    style={{
                      color: "#23272F",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 15,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#34C759",
                    borderRadius: 10,
                    paddingHorizontal: 22,
                    paddingVertical: 10,
                    opacity: proposeReason.trim() ? 1 : 0.5,
                  }}
                  onPress={handlePropose}
                  disabled={proposeLoading || !proposeReason.trim()}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 15,
                    }}
                  >
                    {proposeLoading ? "Proposing..." : "Propose"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Header */}
        <View
          style={{ paddingHorizontal: 24, paddingTop: 0, paddingBottom: 0 }}
        >
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 26,
              color: "#23272F",
              marginBottom: 4,
            }}
          >
            All Applications
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 15,
              color: "#666",
              marginBottom: 12,
            }}
          >
            Review all buddis who have applied for this parent call. You can
            view their details and propose the best fit.
          </Text>
        </View>
        {/* Table Card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            marginTop: 12,
            marginHorizontal: 12,
            padding: 0,
            shadowColor: "#23272F",
            borderWidth: 1,
            borderColor: "#f0f0f0",
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ borderRadius: 18 }}
          >
            <View>
              {/* Table Header */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#FF932E",
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  alignItems: "center",
                  minHeight: 56,
                  borderBottomWidth: 2,
                  borderBottomColor: "#FFE0B2",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <Text
                  style={{
                    minWidth: 160,
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                    color: "#fff",
                    textAlign: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRightWidth: 1,
                    borderRightColor: "#fff",
                  }}
                >
                  Name
                </Text>
                <Text
                  style={{
                    minWidth: 200,
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                    color: "#fff",
                    textAlign: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRightWidth: 1,
                    borderRightColor: "#fff",
                  }}
                >
                  Email
                </Text>
                <Text
                  style={{
                    minWidth: 160,
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                    color: "#fff",
                    textAlign: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRightWidth: 1,
                    borderRightColor: "#fff",
                  }}
                >
                  Applied
                </Text>
                <Text
                  style={{
                    minWidth: 130,
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                    color: "#fff",
                    textAlign: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                  }}
                >
                  Action
                </Text>
              </View>
              {/* Table Rows */}
              {loading ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 40,
                    minWidth: 650,
                  }}
                >
                  <ActivityIndicator size="small" color="#FB8500" />
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 17,
                      color: "#666",
                      marginLeft: 12,
                    }}
                  >
                    Loading applications...
                  </Text>
                </View>
              ) : error ? (
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 40,
                    minWidth: 650,
                  }}
                >
                  <Ionicons name="alert-circle" size={32} color="#FB8500" />
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 16,
                      color: "#666",
                      marginTop: 12,
                      textAlign: "center",
                      lineHeight: 22,
                    }}
                  >
                    {error}
                  </Text>
                  <TouchableOpacity
                    onPress={() => fetchApplications(currentPage)}
                    style={{
                      backgroundColor: "#FF932E",
                      paddingHorizontal: 28,
                      paddingVertical: 14,
                      borderRadius: 14,
                      marginTop: 18,
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 15,
                        color: "#fff",
                      }}
                    >
                      Try Again
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : applications.length === 0 ? (
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 60,
                    minWidth: 650,
                  }}
                >
                  <Ionicons name="people-outline" size={64} color="#ccc" />
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 22,
                      color: "#333",
                      marginTop: 18,
                    }}
                  >
                    No Applications Yet
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 16,
                      color: "#666",
                      marginTop: 10,
                      textAlign: "center",
                      lineHeight: 24,
                      maxWidth: 400,
                    }}
                  >
                    No buddis have applied to this pickup request yet. When they
                    do, you’ll see them here for review and action.
                  </Text>
                </View>
              ) : (
                <>
                  {applications.map((application, idx) => (
                    <View
                      key={application.id}
                      style={{
                        flexDirection: "row",
                        paddingVertical: 18,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: "#f0f0f0",
                        backgroundColor: idx % 2 === 0 ? "#FAFAFA" : "#fff",
                        minWidth: 650,
                        alignItems: "center",
                      }}
                    >
                      {/* Checkbox */}
                      <TouchableOpacity
                        onPress={() => toggleSelect(application.Buddi.id)}
                        style={{
                          marginRight: 16,
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          borderWidth: 2,
                          borderColor: isSelected(application.Buddi.id)
                            ? "#34C759"
                            : "#ccc",
                          backgroundColor: isSelected(application.Buddi.id)
                            ? "#34C759"
                            : "#fff",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity:
                            selectedBuddis.length === 3 &&
                            !isSelected(application.Buddi.id)
                              ? 0.5
                              : 1,
                        }}
                        disabled={
                          selectedBuddis.length === 3 &&
                          !isSelected(application.Buddi.id)
                        }
                      >
                        {isSelected(application.Buddi.id) && (
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        )}
                      </TouchableOpacity>
                      {/* Name */}
                      <View
                        style={{
                          minWidth: 160,
                          borderRightWidth: 1,
                          borderRightColor: "#f0f0f0",
                          paddingHorizontal: 20,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Bold",
                            fontSize: 15,
                            color: "#23272F",
                          }}
                        >
                          {getBuddiName(application)}
                        </Text>
                      </View>
                      {/* Email */}
                      <View
                        style={{
                          minWidth: 200,
                          borderRightWidth: 1,
                          borderRightColor: "#f0f0f0",
                          paddingHorizontal: 20,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Regular",
                            fontSize: 13,
                            color: "#666",
                          }}
                        >
                          {getBuddiEmail(application)}
                        </Text>
                      </View>
                      {/* Applied */}
                      <View
                        style={{
                          minWidth: 160,
                          borderRightWidth: 1,
                          borderRightColor: "#f0f0f0",
                          paddingHorizontal: 20,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Regular",
                            fontSize: 13,
                            color: "#666",
                          }}
                        >
                          {formatDate(application.createdAt)}
                        </Text>
                      </View>
                      {/* Action */}
                      <View
                        style={{
                          minWidth: 130,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#FF932E",
                            paddingHorizontal: 18,
                            paddingVertical: 12,
                            borderRadius: 12,
                            shadowColor: "#FF932E",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.13,
                            shadowRadius: 4,
                            elevation: 2,
                          }}
                          onPress={() => {
                            if (application.Buddi?.id) {
                              router.push({
                                pathname: "/admin/buddi-details/[id]",
                                params: { id: application.Buddi.id.toString() },
                              });
                            }
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Comfortaa-Bold",
                              fontSize: 15,
                              color: "#fff",
                            }}
                          >
                            View
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </View>
          </ScrollView>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 28,
                paddingHorizontal: 16,
                paddingBottom: 18,
                gap: 18,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#FF932E",
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 12,
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
                onPress={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={currentPage === 1 ? "#ccc" : "#FB8500"}
                />
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                    color: "#fff",
                    marginLeft: 8,
                  }}
                >
                  Previous
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: "#f0f0f0",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 15,
                    color: "#23272F",
                  }}
                >
                  Page {currentPage} of {totalPages}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#FF932E",
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 12,
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
                onPress={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                    color: "#fff",
                    marginRight: 8,
                  }}
                >
                  Next
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={currentPage === totalPages ? "#ccc" : "#FB8500"}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
