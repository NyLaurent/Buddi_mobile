import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const tabs = [
  { name: "Home", icon: "home", route: "/parent" },
  { name: "Schedule", icon: "calendar-outline", route: "/parent/schedule" },
  { name: "Search", icon: "search", route: "/parent", center: true },
  { name: "My Buddi", icon: "people-outline", route: "/parent/my-buddi" },
  { name: "Payments", icon: "wallet-outline", route: "/parent/payments" },
];

export default function ParentBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Helper to get all lastSeen keys for this Parent
  const getUnreadCount = async () => {
    // Get all keys
    const keys = await AsyncStorage.getAllKeys();
    // Only check keys for this Parent and chat rooms
    const parentData = await AsyncStorage.getItem("parent_details");
    let id = null;
    try {
      id = parentData ? JSON.parse(parentData).id : null;
    } catch {}
    if (!id) return 0;
    // Find all chat room keys for this Parent
    const chatRoomKeys = keys.filter(
      (k) => k.startsWith(`lastSeen_`) && k.endsWith(`_${id}`)
    );
    let count = 0;
    for (const key of chatRoomKeys) {
      const lastSeen = await AsyncStorage.getItem(key);
      // Extract roomId from key
      const roomId = key.replace(`lastSeen_`, "").replace(`_${id}`, "");
      // Get latest message timestamp for this room from AsyncStorage (set by messages page)
      const latestMsgKey = `latestMsg_${roomId}`;
      const latestMsg = await AsyncStorage.getItem(latestMsgKey);
      if (
        latestMsg &&
        (!lastSeen || new Date(latestMsg) > new Date(lastSeen))
      ) {
        count++;
      }
    }
    setUnreadCount(count);
  };

  useEffect(() => {
    const interval = setInterval(getUnreadCount, 2000); // Poll every 2s
    getUnreadCount();
    return () => clearInterval(interval);
  }, []);

  const isActiveTab = (route: string) => {
    return pathname === route;
  };

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          height: 70,
        }}
      >
        {/* First two tabs */}
        {tabs.slice(0, 2).map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.route as any)}
            style={{ alignItems: "center", flex: 1, paddingVertical: 8 }}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={pathname === tab.route ? "#FF932E" : "#666"}
            />
            <Text
              style={{
                color: pathname === tab.route ? "#FF932E" : "#666",
                fontFamily: "Comfortaa-Regular",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Center Chat Button */}
        <TouchableOpacity
          style={{
            marginTop: -40,
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => router.push("/parent/messages" as any)}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#FF932E",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#FF932E",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 8,
            }}
          >
            <Ionicons name="chatbubbles-outline" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Last two tabs */}
        {tabs.slice(3).map((tab) => (
          <Link key={tab.name} href={tab.route as any} asChild>
            <TouchableOpacity
              style={{ alignItems: "center", flex: 1, paddingVertical: 8 }}
            >
              <View style={{ position: "relative" }}>
                <Ionicons
                  name={tab.icon as any}
                  size={24}
                  color={isActiveTab(tab.route) ? "#FF932E" : "#666"}
                />
                {/* Show unread bubble only on Messages tab */}
                {tab.name === "Messages" && unreadCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -12,
                      backgroundColor: "#FF3B30",
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 5,
                      zIndex: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        fontFamily: "Comfortaa-Bold",
                      }}
                    >
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  color: isActiveTab(tab.route) ? "#FF932E" : "#666",
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  );
}
