import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BuddiService from "../../../../services/api/buddi.service";
import ParentService, {
  Application,
} from "../../../../services/api/parent.service";

export default function AllApplicationsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
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

  useEffect(() => {
    fetchApplications(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentPage]);

  const fetchApplications = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ParentService.getRequestApplications(
        Number(id),
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
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
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 0, paddingBottom: 0 }}>
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
          Review all buddis who have applied for this parent call. You can view
          their details and propose the best fit.
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
                  <TouchableOpacity
                    key={application.id}
                    activeOpacity={0.96}
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
                  </TouchableOpacity>
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
    </SafeAreaView>
  );
}
