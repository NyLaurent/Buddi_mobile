import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const tabs = [
  { name: "Home", icon: "home", route: "/parent" },
  { name: "Schedule", icon: "calendar-outline", route: "/parent/schedule" },
  { name: "My Buddi", icon: "people-outline", route: "/parent/mybuddi" },
  { name: "Payments", icon: "wallet-outline", route: "/parent/payments" },
];

export default function ParentBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

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

        {/* Middle + button */}
        <TouchableOpacity
          style={{
            marginTop: -60,
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            /* Add your action here */
          }}
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
            <Ionicons name="add" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Last two tabs */}
        {tabs.slice(2).map((tab) => (
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
      </View>
    </View>
  );
}
