import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PendingTimesheetCard from "../../components/parent/PendingTimesheetCard";
import { useAuth } from "../../context/AuthContext";
import ParentService, { Timesheet } from "../../services/api/parent.service";

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const { parentDetails } = useAuth();

  const fetchTimesheets = async (
    page: number = 1,
    isRefresh: boolean = false
  ) => {
    if (!parentDetails?.id) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // API: GET /timesheets/parent/{parentId}/buddi/{buddiId}?page={page}&limit={limit}
      const response = await ParentService.getTimesheets(
        parentDetails.id.toString(),
        undefined,
        page,
        10
      );
      setTimesheets(response.data);
      setCurrentPage(response.page);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (err: any) {
      setError(err.message || "Failed to fetch timesheets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTimesheets(1);
  }, [parentDetails?.id]);

  const handleRefresh = () => {
    fetchTimesheets(1, true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatWeekRange = (weekStart: string, weekEnd: string) => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  };

  const getWeekLabel = (weekStart: string) => {
    const date = new Date(weekStart);
    return `Week of ${date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })}`;
  };

  const getVariant = (isPaid: boolean, isApproved: boolean) => {
    if (isPaid) return "paid";
    if (isApproved) return "approved";
    return "pending";
  };

  const renderTimesheetCard = (timesheet: Timesheet) => (
    <PendingTimesheetCard
      key={timesheet.id}
      week={getWeekLabel(timesheet.weekStart)}
      dateRange={formatWeekRange(timesheet.weekStart, timesheet.weekEnd)}
      shifts={timesheet.totalPickups}
      pendingAmount={`$${timesheet.totalEarnings.toFixed(2)}`}
      variant={getVariant(timesheet.isPaid, timesheet.isApproved)}
      onPress={() => {
        // Navigate to timesheet details page
        router.push(`/parent/timesheet-details/${timesheet.id}` as any);
      }}
      onGoToPayment={() => {
        // Navigate to payments page
        router.push("/parent/payments" as any);
      }}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#FF932E",
            borderRadius: 12,
            padding: 8,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 18,
            color: "#232B3A",
          }}
        >
          Buddi Timesheets
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={{ flex: 1, padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
            }}
          >
            <ActivityIndicator size="large" color="#FF932E" />
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
                color: "#6B7280",
                marginTop: 12,
              }}
            >
              Loading timesheets...
            </Text>
          </View>
        ) : error ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
            }}
          >
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text
              style={{
                fontFamily: "Comfortaa-Medium",
                fontSize: 16,
                color: "#EF4444",
                marginTop: 12,
                textAlign: "center",
              }}
            >
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => fetchTimesheets(1)}
              style={{
                backgroundColor: "#FF932E",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                marginTop: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : timesheets.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
            }}
          >
            <Ionicons name="document-text-outline" size={48} color="#6B7280" />
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#232B3A",
                marginTop: 12,
                textAlign: "center",
              }}
            >
              No Timesheets Yet
            </Text>
            <Text
              style={{
                fontFamily: "Comfortaa-Regular",
                fontSize: 14,
                color: "#6B7280",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Timesheets will appear here once trips are completed
            </Text>
          </View>
        ) : (
          <>
            {timesheets.map(renderTimesheetCard)}

            {/* Pagination */}
            {totalPages > 1 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => fetchTimesheets(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    backgroundColor: currentPage === 1 ? "#E5E7EB" : "#FF932E",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 14,
                      color: currentPage === 1 ? "#9CA3AF" : "#fff",
                    }}
                  >
                    Previous
                  </Text>
                </TouchableOpacity>

                <Text
                  style={{
                    fontFamily: "Comfortaa-Medium",
                    fontSize: 14,
                    color: "#6B7280",
                    marginHorizontal: 12,
                  }}
                >
                  {currentPage} of {totalPages}
                </Text>

                <TouchableOpacity
                  onPress={() => fetchTimesheets(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    backgroundColor:
                      currentPage === totalPages ? "#E5E7EB" : "#FF932E",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 14,
                      color: currentPage === totalPages ? "#9CA3AF" : "#fff",
                    }}
                  >
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}