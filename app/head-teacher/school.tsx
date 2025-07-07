import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SchoolPage = () => {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Orange Header with Avatar, Name, Email */}
      <View
        style={{
          backgroundColor: "#FF9100",
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          paddingBottom: 16,
          alignItems: "center",
          paddingTop: 48,
          position: "relative",
        }}
      >
        {/* Back and Menu Buttons */}
        <View style={{ position: "absolute", left: 16, top: 48 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#fff", borderRadius: 12, padding: 8 }}
          >
            <Ionicons name="arrow-back" size={20} color="#FF9100" />
          </TouchableOpacity>
        </View>
        <View style={{ position: "absolute", right: 16, top: 48 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#fff", borderRadius: 12, padding: 8 }}
          >
            <Ionicons name="document-text-outline" size={20} color="#FF9100" />
          </TouchableOpacity>
        </View>
        <Image
          source={require("../../assets/images/parent/no-buddi.png")}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            marginBottom: 12,
            backgroundColor: "#fff",
          }}
        />
        <Text
          style={{
            color: "#fff",
            fontSize: 20,
            fontFamily: "Comfortaa-Bold",
            marginBottom: 2,
          }}
        >
          John Doe Smith
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 15,
            fontFamily: "Comfortaa-Regular",
          }}
        >
          johndoe@gmail.com
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Tab */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F8F9FE",
            borderRadius: 20,
            marginHorizontal: 16,
            marginTop: 8,
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: activeTab === "General" ? "#fff" : "transparent",
            }}
            onPress={() => setActiveTab("General")}
          >
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                color: activeTab === "General" ? "#FF9100" : "#BDBDBD",
              }}
            >
              General
            </Text>
          </TouchableOpacity>
        </View>
        {/* Details Section */}
        <View
          style={{
            marginTop: 24,
            marginHorizontal: 16,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontFamily: "Comfortaa-Bold", fontSize: 17 }}>
              Your Details
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#FF9100",
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 15,
                  marginRight: 6,
                }}
              >
                Edit Profile
              </Text>
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Details List */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#F0F0F0",
              marginTop: 8,
            }}
          >
            {/* Full Names */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#F0F0F0",
              }}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color="#BDBDBD"
                style={{ marginRight: 12 }}
              />
              <View>
                <Text
                  style={{
                    color: "#BDBDBD",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 13,
                  }}
                >
                  Full Names
                </Text>
                <Text
                  style={{
                    color: "#23272F",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                  }}
                >
                  John Doe
                </Text>
              </View>
            </View>
            {/* Tel */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#F0F0F0",
              }}
            >
              <Ionicons
                name="call-outline"
                size={18}
                color="#BDBDBD"
                style={{ marginRight: 12 }}
              />
              <View>
                <Text
                  style={{
                    color: "#BDBDBD",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 13,
                  }}
                >
                  Tel
                </Text>
                <Text
                  style={{
                    color: "#23272F",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                  }}
                >
                  +250-786-564-924
                </Text>
              </View>
            </View>
            {/* Email */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#F0F0F0",
              }}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color="#BDBDBD"
                style={{ marginRight: 12 }}
              />
              <View>
                <Text
                  style={{
                    color: "#BDBDBD",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 13,
                  }}
                >
                  Email
                </Text>
                <Text
                  style={{
                    color: "#23272F",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                  }}
                >
                  johndoe@example.com
                </Text>
              </View>
            </View>
            {/* School Name */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#F0F0F0",
              }}
            >
              <Ionicons
                name="school-outline"
                size={18}
                color="#BDBDBD"
                style={{ marginRight: 12 }}
              />
              <View>
                <Text
                  style={{
                    color: "#BDBDBD",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 13,
                  }}
                >
                  School Name
                </Text>
                <Text
                  style={{
                    color: "#23272F",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                  }}
                >
                  NYU – Year 2, Child Psychology
                </Text>
              </View>
            </View>
            {/* Location */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
              }}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color="#BDBDBD"
                style={{ marginRight: 12 }}
              />
              <View>
                <Text
                  style={{
                    color: "#BDBDBD",
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 13,
                  }}
                >
                  Location
                </Text>
                <Text
                  style={{
                    color: "#23272F",
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                  }}
                >
                  Brooklyn, New York
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* View References Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#FF9100",
            borderRadius: 30,
            paddingVertical: 14,
            alignItems: "center",
            marginHorizontal: 32,
            marginTop: 32,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "Comfortaa-Bold",
              fontSize: 17,
              marginRight: 8,
            }}
          >
            View References
          </Text>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SchoolPage;
