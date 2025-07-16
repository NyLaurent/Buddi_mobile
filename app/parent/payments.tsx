import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnalyticsCard from "../../components/commons/AnalyticsCard";
import PageHeader from "../../components/commons/PageHeader";
import BuyTokensCTA from "../../components/parent/BuyTokensCTA";

const Payments = () => {
  // Handler for BuyTokensCTA (could be a navigation or modal trigger)
  const handleBuyTokens = () => {
    // You can add navigation or modal logic here
    // For now, just a placeholder
    // e.g., navigate to /parent/payments or open a modal
  };

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
              onPress={handleBuyTokens}
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
          </View>
          <View className="px-3">
            <Text>Test</Text>
          </View>
          {/* Add your payment content here */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Payments;
