// app/buddi/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnalyticsCard from "../../components/commons/AnalyticsCard";
import Calendar from "../../components/commons/Calendar";
import PickupCard from "../../components/commons/PickupCard";
import Messages from "./messages";
import SchedulePage from "./schedule";

const DOT_SIZE = 8;
const DOT_SPACING = 12;
const DOT_COLOR_ACTIVE = "#FF932E";
const DOT_COLOR_INACTIVE = "#E0E0E0";

export default function BuddiHome() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const cardWidth = 300 + 12; // card width + margin
    const newIndex = Math.round(contentOffset / cardWidth);
    setActiveCard(newIndex);
  };

  const renderBottomTabs = () => {
    return (
      <View
        className="absolute bottom-0 left-0 right-0 bg-white flex-row justify-around items-center border-t border-gray/10 shadow-lg"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
          height: Platform.select({
            ios: 80 + insets.bottom,
            android: 65 + insets.bottom,
          }),
        }}
      >
        <TouchableOpacity
          className="items-center justify-center py-2"
          onPress={() => setActiveTab(0)}
        >
          <Ionicons
            name="home"
            size={24}
            color={activeTab === 0 ? "#FF932E" : "#666"}
          />
          <Text
            className={`mt-1 text-xs font-comfortaa ${
              activeTab === 0 ? "text-primary" : "text-gray-500"
            }`}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center justify-center py-2"
          onPress={() => setActiveTab(1)}
        >
          <Ionicons
            name="calendar-outline"
            size={24}
            color={activeTab === 1 ? "#FF932E" : "#666"}
          />
          <Text
            className={`mt-1 text-xs font-comfortaa ${
              activeTab === 1 ? "text-primary" : "text-gray-500"
            }`}
          >
            Schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}>
          <View style={styles.addButtonInner}>
            <Ionicons name="add" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center justify-center py-2"
          onPress={() => setActiveTab(3)}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color={activeTab === 3 ? "#FF932E" : "#666"}
          />
          <Text
            className={`mt-1 text-xs font-comfortaa ${
              activeTab === 3 ? "text-primary" : "text-gray-500"
            }`}
          >
            Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center justify-center py-2"
          onPress={() => setActiveTab(4)}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={activeTab === 4 ? "#FF932E" : "#666"}
          />
          <Text
            className={`mt-1 text-xs font-comfortaa ${
              activeTab === 4 ? "text-primary" : "text-gray-500"
            }`}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHomeContent = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 pt-2"
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: Platform.select({
            ios: 90 + insets.bottom,
            android: 80 + insets.bottom,
          }),
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

        <Text className="text-2xl font-comfortaa-bold m-4">
          Good morning, Jane
        </Text>
        <Text className="text-gray-500 font-comfortaa mx-5">
          Happy that you are back 😊
        </Text>

        {/* Analytics Cards */}
        <View className="flex-row justify-between px-4 pt-4 gap-3">
          <AnalyticsCard
            icon={
              <View className="bg-[#8B5CF6] w-10 h-10 rounded-full items-center justify-center">
                <Ionicons name="flash" size={20} color="white" />
              </View>
            }
            title="Today's Pickups"
            value="12"
            subtitle="2 Schools"
          />
          <AnalyticsCard
            icon={
              <View className="bg-[#00C6AE] w-10 h-10 rounded-full items-center justify-center">
                <Ionicons name="wallet" size={20} color="white" />
              </View>
            }
            title="Total Earnings"
            value="$1,234"
            subtitle="All time"
          />
        </View>

        {/* Congratulations */}
        <View className="mx-4 mt-6 bg-[#FAFBFC] rounded-2xl p-4 flex-row justify-between items-center border border-[#C1C3C7] shadow-sm">
          <View className="flex-row items-center gap-3">
            <View className="bg-[#FFE7D3] p-2 rounded-xl">
              <Ionicons name="trophy" size={24} color="#FF932E" />
            </View>
            <View>
              <Text className="font-comfortaa-bold text-lg">
                Congratulations! 🎉
              </Text>
              <Text className="text-gray-500 font-comfortaa">
                23XP • 23 Reviews
              </Text>
            </View>
          </View>
          <TouchableOpacity className="py-2 px-3 rounded-xl flex-row items-center gap-2">
            <Text className="text-gray-500 font-comfortaa">View</Text>
            <Ionicons name="arrow-forward" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Pickups Header */}
        <View className="flex-row justify-between items-center mx-4 mb-2 pt-5">
          <Text className="font-comfortaa-bold text-xl">Pickups</Text>
          <TouchableOpacity>
            <Text className="text-primary font-comfortaa">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Pickup Cards Horizontal */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={312} // card width (300) + margin (12)
        >
          <PickupCard
            name="Bryan Smith"
            time="2:23:04"
            days="5 Days a Week"
            school="School Name"
            home="Senen"
            onViewDetails={() => {}}
            onButtonPress={() => {}}
          />
          <PickupCard
            name="Sarah Johnson"
            time="3:15:00"
            days="3 Days a Week"
            school="Lincoln High"
            home="Downtown"
            onViewDetails={() => {}}
            onButtonPress={() => {}}
          />
          <PickupCard
            name="Mike Wilson"
            time="1:45:30"
            days="4 Days a Week"
            school="St. Mary's"
            home="Westside"
            onViewDetails={() => {}}
            onButtonPress={() => {}}
          />
          <PickupCard
            name="Emma Davis"
            time="4:00:00"
            days="2 Days a Week"
            school="Oak Elementary"
            home="Eastside"
            onViewDetails={() => {}}
            onButtonPress={() => {}}
          />
        </ScrollView>

        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center gap-2 mt-4 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: DOT_SIZE / 2,
                marginHorizontal: DOT_SPACING / 2,
                backgroundColor:
                  index === activeCard ? DOT_COLOR_ACTIVE : DOT_COLOR_INACTIVE,
              }}
            />
          ))}
        </View>

        {/* Calendar Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mx-4 mb-2">
            <Text className="font-comfortaa-bold text-xl">Schedule</Text>
            <TouchableOpacity>
              <Text className="text-primary font-comfortaa">View All</Text>
            </TouchableOpacity>
          </View>
          <Calendar
            selectedDate={selectedDate}
            onDaySelect={(date) => setSelectedDate(date)}
            primaryColor="#FF932E"
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="absolute top-0 left-0 right-0 z-50 bg-white">
        <StatusBar backgroundColor="white" barStyle="dark-content" />
      </View>

      {/* Conditional rendering based on activeTab */}
      {activeTab === 0 && renderHomeContent()}
      {activeTab === 1 && (
        <View className="flex-1">
          <SchedulePage />
        </View>
      )}
      {activeTab === 3 && (
        <View className="flex-1">
          <Messages />
        </View>
      )}
      {activeTab === 4 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-comfortaa-bold">Profile</Text>
          <Text className="text-gray-500 font-comfortaa mt-2">
            Coming soon...
          </Text>
        </View>
      )}

      {renderBottomTabs()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 16,
    fontFamily: "Comfortaa-Bold",
  },
  subGreeting: {
    color: "#888",
    marginHorizontal: 16,
    fontFamily: "Comfortaa-Regular",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
  },
  iconCircle: {
    padding: 10,
    borderRadius: 20,
  },
  congratsContainer: {
    margin: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  congratsContent: {
    flex: 1,
  },
  congratsTitle: {
    fontWeight: "bold",
    fontFamily: "Comfortaa-Bold",
  },
  congratsText: {
    color: "#666",
    marginTop: 4,
    fontFamily: "Comfortaa-Regular",
  },
  viewHistoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewHistoryText: {
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  pickupsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 16,
  },
  pickupsTitle: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Comfortaa-Bold",
  },
  viewAll: {
    color: "#FF932E",
    fontFamily: "Comfortaa-Regular",
  },
  bottomTabs: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontFamily: "Comfortaa-Regular",
  },
  activeTabLabel: {
    color: "#FF932E",
    fontFamily: "Comfortaa-Medium",
  },
  addButton: {
    marginTop: -30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF932E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF932E",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});
