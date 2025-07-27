import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnalyticsCard from "../../components/commons/AnalyticsCard";
import PageHeader from "../../components/commons/PageHeader";
import BuyTokensCTA from "../../components/parent/BuyTokensCTA";
import PendingTimesheetCard from "../../components/parent/PendingTimesheetCard";
import { useAuth } from "../../context/AuthContext";
import ParentService, { Timesheet } from "../../services/api/parent.service";

const Payments = () => {
  // Handler for BuyTokensCTA (could be a navigation or modal trigger)
  const handleBuyTokens = () => {
    // You can add navigation or modal logic here
    // For now, just a placeholder
    // e.g., navigate to /parent/payments or open a modal
  };

  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { parentDetails } = useAuth();

  const fetchTimesheets = async () => {
    if (!parentDetails?.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await ParentService.getTimesheets(
        parentDetails.id.toString(),
        undefined,
        1,
        100
      );
      setTimesheets(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch timesheets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, [parentDetails?.id]);

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

  const filteredTimesheets = timesheets.filter((timesheet) => {
    if (activeTab === "pending") {
      return !timesheet.isPaid;
    } else {
      return timesheet.isPaid;
    }
  });

  const pendingCount = timesheets.filter((ts) => !ts.isPaid).length;
  const paidCount = timesheets.filter((ts) => ts.isPaid).length;
  const totalEarnings = timesheets.reduce(
    (sum, ts) => sum + ts.totalEarnings,
    0
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        <View className="pt-4">
          <PageHeader title="Payments" />
          <View className="px-3">
            <BuyTokensCTA
              onPress={() => router.push("/parent/buy-tokens")}
              title="Top Up Your Tokens"
              message="Unlock more rides and features for your family by topping up your Buddi tokens. Enjoy seamless, secure payments!"
              showButtonBelow={true}
            />
            {/* 2x2 Analytics Cards Grid */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginTop: 18,
                marginBottom: 8,
              }}
            >
              <View style={{ width: "48%", marginBottom: 16 }}>
                <AnalyticsCard
                  icon={<Ionicons name="flash" size={32} color="#2196F3" />}
                  value={timesheets.length.toString()}
                  title="Timesheets"
                />
              </View>
              <View style={{ width: "48%", marginBottom: 16 }}>
                <AnalyticsCard
                  icon={
                    <Ionicons name="timer-outline" size={32} color="#03A9F4" />
                  }
                  value={pendingCount.toString()}
                  title="Pending"
                />
              </View>
              <View style={{ width: "48%", marginBottom: 8 }}>
                <AnalyticsCard
                  icon={
                    <FontAwesome5
                      name="money-bill-wave"
                      size={32}
                      color="#A259FF"
                    />
                  }
                  value={paidCount.toString()}
                  title="Paid"
                />
              </View>
              <View style={{ width: "48%", marginBottom: 8 }}>
                <AnalyticsCard
                  icon={<Ionicons name="people" size={32} color="#FF9100" />}
                  value={`$${totalEarnings.toFixed(2)}`}
                  title="Total Earnings"
                />
              </View>
            </View>
            {/* Tab Switcher for Timesheets */}
            <View style={{ marginTop: 18, marginBottom: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#F8F9FE",
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: 48,
                  marginBottom: 12,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: "center",
                    borderRadius: 12,
                    backgroundColor:
                      activeTab === "pending" ? "#fff" : "transparent",
                    margin: 2,
                    paddingVertical: activeTab === "pending" ? 12 : 10,
                  }}
                  onPress={() => setActiveTab("pending")}
                >
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: activeTab === "pending" ? "#232B3A" : "#71727A",
                    }}
                  >
                    Pending
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: "center",
                    borderRadius: 12,
                    backgroundColor:
                      activeTab === "paid" ? "#fff" : "transparent",
                    margin: 2,
                    paddingVertical: activeTab === "paid" ? 12 : 10,
                  }}
                  onPress={() => setActiveTab("paid")}
                >
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: activeTab === "paid" ? "#232B3A" : "#71727A",
                    }}
                  >
                    Paid Timesheets
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Tab Content */}
              {activeTab === "pending" ? (
                <View style={{ paddingVertical: 16 }}>
                  {/* Search and Filter Row */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 18,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#F6F7FB",
                        borderRadius: 999,
                        paddingHorizontal: 8,
                        height: 44,
                      }}
                    >
                      <Ionicons
                        name="search"
                        size={20}
                        color="#BDBDBD"
                        style={{ marginRight: 4, marginLeft: 8 }}
                      />
                      <TextInput
                        style={{
                          flex: 1,
                          color: "#232B3A",
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 15,
                          paddingVertical: 0,
                        }}
                        placeholder="Search"
                        placeholderTextColor="#BDBDBD"
                        value={search}
                        onChangeText={setSearch}
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        autoCapitalize="none"
                      />
                    </View>
                    <TouchableOpacity
                      style={{
                        marginLeft: 12,
                        backgroundColor: "#F6F7FB",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        height: 44,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="filter"
                        size={20}
                        color="#BDBDBD"
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          color: "#232B3A",
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 15,
                        }}
                      >
                        Filter
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Pending Timesheet Cards */}
                  {loading ? (
                    <View style={{ alignItems: "center", paddingVertical: 40 }}>
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 14,
                          color: "#6B7280",
                        }}
                      >
                        Loading timesheets...
                      </Text>
                    </View>
                  ) : error ? (
                    <View style={{ alignItems: "center", paddingVertical: 40 }}>
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Medium",
                          fontSize: 14,
                          color: "#EF4444",
                          textAlign: "center",
                        }}
                      >
                        {error}
                      </Text>
                    </View>
                  ) : filteredTimesheets.length === 0 ? (
                    <View style={{ alignItems: "center", paddingVertical: 40 }}>
                      <Ionicons
                        name="document-text-outline"
                        size={48}
                        color="#6B7280"
                      />
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Bold",
                          fontSize: 16,
                          color: "#232B3A",
                          marginTop: 12,
                          textAlign: "center",
                        }}
                      >
                        No {activeTab === "pending" ? "Pending" : "Paid"}{" "}
                        Timesheets
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
                        {activeTab === "pending"
                          ? "All timesheets have been paid"
                          : "No paid timesheets yet"}
                      </Text>
                    </View>
                  ) : (
                    filteredTimesheets.map((timesheet) => (
                      <PendingTimesheetCard
                        key={timesheet.id}
                        week={getWeekLabel(timesheet.weekStart)}
                        dateRange={formatWeekRange(
                          timesheet.weekStart,
                          timesheet.weekEnd
                        )}
                        shifts={timesheet.totalPickups}
                        pendingAmount={`$${timesheet.totalEarnings.toFixed(2)}`}
                        variant={getVariant(
                          timesheet.isPaid,
                          timesheet.isApproved
                        )}
                        onPress={() => {
                          router.push(
                            `/parent/timesheet-details/${timesheet.id}` as any
                          );
                        }}
                        onGoToPayment={() => {
                          // Handle payment action
                          console.log(
                            "Process payment for timesheet:",
                            timesheet.id
                          );
                        }}
                      />
                    ))
                  )}
                </View>
              ) : (
                <View style={{ paddingVertical: 16 }}>
                  {/* Search and Filter Row */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 18,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#F6F7FB",
                        borderRadius: 999,
                        paddingHorizontal: 8,
                        height: 44,
                      }}
                    >
                      <Ionicons
                        name="search"
                        size={20}
                        color="#BDBDBD"
                        style={{ marginRight: 4, marginLeft: 8 }}
                      />
                      <TextInput
                        style={{
                          flex: 1,
                          color: "#232B3A",
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 15,
                          paddingVertical: 0,
                        }}
                        placeholder="Search"
                        placeholderTextColor="#BDBDBD"
                        value={search}
                        onChangeText={setSearch}
                        underlineColorAndroid="transparent"
                        autoCorrect={false}
                        autoCapitalize="none"
                      />
                    </View>
                    <TouchableOpacity
                      style={{
                        marginLeft: 12,
                        backgroundColor: "#F6F7FB",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        height: 44,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="filter"
                        size={20}
                        color="#BDBDBD"
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          color: "#232B3A",
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 15,
                        }}
                      >
                        Filter
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Paid Timesheet Cards */}
                  {loading ? (
                    <View style={{ alignItems: "center", paddingVertical: 40 }}>
                      <Text style={{ fontFamily: "Comfortaa-Regular", fontSize: 14, color: "#6B7280" }}>
                        Loading timesheets...
                      </Text>
                    </View>
                  ) : error ? (
                    <View style={{ alignItems: "center", paddingVertical: 40 }}>
                      <Text style={{ fontFamily: "Comfortaa-Medium", fontSize: 14, color: "#EF4444", textAlign: "center" }}>
                        {error}
                      </Text>
                    </View>
                  ) : filteredTimesheets.length === 0 ? (
                    <View style={{ alignItems: "center", paddingVertical: 40 }}>
                      <Ionicons name="document-text-outline" size={48} color="#6B7280" />
                      <Text style={{ fontFamily: "Comfortaa-Bold", fontSize: 16, color: "#232B3A", marginTop: 12, textAlign: "center" }}>
                        No Paid Timesheets
                      </Text>
                      <Text style={{ fontFamily: "Comfortaa-Regular", fontSize: 14, color: "#6B7280", marginTop: 8, textAlign: "center" }}>
                        No paid timesheets yet
                      </Text>
                    </View>
                  ) : (
                    filteredTimesheets.map((timesheet) => (
                      <PendingTimesheetCard
                        key={timesheet.id}
                        week={getWeekLabel(timesheet.weekStart)}
                        dateRange={formatWeekRange(timesheet.weekStart, timesheet.weekEnd)}
                        shifts={timesheet.totalPickups}
                        pendingAmount={`$${timesheet.totalEarnings.toFixed(2)}`}
                        variant={getVariant(timesheet.isPaid, timesheet.isApproved)}
                        onPress={() => {
                          router.push(`/parent/timesheet-details/${timesheet.id}` as any);
                        }}
                      />
                    ))
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Payments;
