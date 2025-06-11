import CoverageAlertCard from "@/components/admin/CoverageAlertCard";
import AnalyticsCard from "@/components/commons/AnalyticsCard";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Platform.OS === "android" ? 32 : 0,
          backgroundColor: "white",
          zIndex: 10,
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 2,
          paddingTop: Platform.OS === "android" ? 32 : 0,
        }}
      >
        <View className="flex-row justify-between px-1 pt-6">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-[75px] h-[40px]"
            resizeMode="contain"
          />
          <View className="flex-row items-center gap-2 pr-1">
            <TouchableOpacity className="p-2 bg-primary rounded-xl shadow-sm">
              <Ionicons name="search-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-primary rounded-xl shadow-sm">
              <Ionicons name="notifications-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
          className="px-2 pt-3"
        >
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={<Ionicons name="flash" size={36} color="#3BC3FF" />}
              title="Total Buddis"
              value="12"
              subtitle="2 Schools"
            />
          </View>
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={
                <MaterialCommunityIcons name="cash" size={36} color="#7B61FF" />
              }
              title="Pending Payments"
              value="3"
              subtitle="All time"
            />
          </View>
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={<Ionicons name="people" size={36} color="#FF5A7D" />}
              title="Registered Parents"
              value="3"
              subtitle="Connected"
            />
          </View>
          <View style={{ width: "48%", marginBottom: 12 }}>
            <AnalyticsCard
              icon={<Ionicons name="person" size={36} color="#A259FF" />}
              title="Pending Buddi Applications"
              value="2"
              subtitle="2 Schools"
            />
          </View>
        </View>

        <View>
          <CoverageAlertCard
            title="21 Buddis Need Coverage For Today"
            subtitle="Review this before effects!"
            description="Please review Buddis requesting coverage to ensure availability and reliability."
            primaryButton={{
              label: "Handle Coverages",
              icon: <Ionicons name="reload" size={20} color="#fff" />,
              onPress: () => {
                /* handle action */
              },
            }}
          />
          <CoverageAlertCard
            title="21 Buddis Need Coverage For Today"
            subtitle="Review this before effects!"
            description="Please review Buddis requesting coverage to ensure availability and reliability."
            secondaryButton={{
              label: "Deploy 2nd",
              icon: (
                <Ionicons
                  name="git-network-outline"
                  size={20}
                  color="#23272F"
                />
              ),
              onPress: () => {
                /* handle deploy */
              },
            }}
            primaryButton={{
              label: "View All",
              icon: <Ionicons name="person-outline" size={20} color="#fff" />,
              onPress: () => {
                /* handle view all */
              },
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    margin: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#1a1a1a",
  },
  activityCard: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 10,
  },
  noActivity: {
    color: "#666",
    textAlign: "center",
  },
});
