import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const tabs = [
  { name: "Home", icon: "home", route: "/buddi" },
  { name: "Schedule", icon: "calendar-outline", route: "/buddi/schedule" },
  { name: "Add", icon: "add", route: "", center: true },
  {
    name: "Messages",
    icon: "chatbubble-ellipses-outline",
    route: "/buddi/messages",
  },
  { name: "Profile", icon: "person-outline", route: "/buddi/profile" },
];

export default function BuddiBottomNav() {
  const pathname = usePathname();

  const isActiveTab = (route: string) => {
    if (route === "/buddi") {
      return (
        pathname === "/buddi" ||
        pathname === "/buddi/" ||
        pathname === "/buddi/index"
      );
    }
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
          <Link key={tab.name} href={tab.route as any} asChild>
            <TouchableOpacity
              style={{ alignItems: "center", flex: 1, paddingVertical: 8 }}
            >
              <Ionicons
                name={tab.icon as any}
                size={24}
                color={isActiveTab(tab.route) ? "#FF932E" : "#666"}
              />
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

        {/* Center Add Button */}
        <TouchableOpacity
          style={{
            marginTop: -40,
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
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
        {tabs.slice(3).map((tab) => (
          <Link key={tab.name} href={tab.route as any} asChild>
            <TouchableOpacity
              style={{ alignItems: "center", flex: 1, paddingVertical: 8 }}
            >
              <Ionicons
                name={tab.icon as any}
                size={24}
                color={isActiveTab(tab.route) ? "#FF932E" : "#666"}
              />
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
