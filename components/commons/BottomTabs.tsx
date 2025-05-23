import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface TabItem {
  icon: string;
  label: string;
  onPress: () => void;
}

interface BottomTabsProps {
  tabs: TabItem[];
  activeIndex: number;
  onAddPress?: () => void;
}

const BottomTabs = ({ tabs, activeIndex, onAddPress }: BottomTabsProps) => {
  // Insert the add button in the middle
  const firstHalf = tabs.slice(0, 2);
  const secondHalf = tabs.slice(2, 4);

  return (
    <View style={styles.container}>
      {/* First half of tabs */}
      {firstHalf.map((tab, idx) => (
        <TouchableOpacity
          key={tab.label}
          style={styles.tab}
          onPress={tab.onPress}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeIndex === idx ? "#FF932E" : "#666"}
          />
          <Text
            style={[styles.label, activeIndex === idx && styles.activeLabel]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Center Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <View style={styles.addButtonInner}>
          <Ionicons name="add" size={32} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Second half of tabs */}
      {secondHalf.map((tab, idx) => (
        <TouchableOpacity
          key={tab.label}
          style={styles.tab}
          onPress={tab.onPress}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeIndex === idx + 2 ? "#FF932E" : "#666"}
          />
          <Text
            style={[
              styles.label,
              activeIndex === idx + 2 && styles.activeLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingBottom: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    height: 70,
    alignItems: "center",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontFamily: "Comfortaa-Regular",
  },
  activeLabel: {
    color: "#FF932E",
    fontFamily: "Comfortaa-Bold",
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
  },
  addButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF932E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF932E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default BottomTabs;
