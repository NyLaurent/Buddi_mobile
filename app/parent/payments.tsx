import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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

const Payments = () => {
  // Handler for BuyTokensCTA (could be a navigation or modal trigger)
  const handleBuyTokens = () => {
    // You can add navigation or modal logic here
    // For now, just a placeholder
    // e.g., navigate to /parent/payments or open a modal
  };

  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const router = useRouter();

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
                  value="12"
                  title="Timesheets"
                />
              </View>
              <View style={{ width: "48%", marginBottom: 16 }}>
                <AnalyticsCard
                  icon={
                    <Ionicons name="timer-outline" size={32} color="#03A9F4" />
                  }
                  value="12"
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
                  value="12"
                  title="Paid"
                />
              </View>
              <View style={{ width: "48%", marginBottom: 8 }}>
                <AnalyticsCard
                  icon={<Ionicons name="people" size={32} color="#FF9100" />}
                  value="12"
                  title="Buddis"
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
                  <PendingTimesheetCard
                    week="Week 1"
                    dateRange="2-8 th, May, 2025"
                    shifts={23}
                    pendingAmount="$40"
                    onGoToPayment={() => {}}
                  />
                  <PendingTimesheetCard
                    week="Week 1"
                    dateRange="2-8 th, May, 2025"
                    shifts={23}
                    pendingAmount="$40"
                    onGoToPayment={() => {}}
                  />
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
                  <PendingTimesheetCard
                    week="Week 1"
                    dateRange="2-8 th, May, 2025"
                    shifts={23}
                    pendingAmount="$40"
                    variant="paid"
                  />
                  <PendingTimesheetCard
                    week="Week 1"
                    dateRange="2-8 th, May, 2025"
                    shifts={23}
                    pendingAmount="$40"
                    variant="paid"
                  />
                  <PendingTimesheetCard
                    week="Week 1"
                    dateRange="2-8 th, May, 2025"
                    shifts={23}
                    pendingAmount="$40"
                    variant="paid"
                  />
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
