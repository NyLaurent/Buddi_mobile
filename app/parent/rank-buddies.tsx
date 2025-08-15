import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RankBuddiesPage = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={handleBackPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#FFF7ED",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#FF932E" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 24,
              color: "#1F2937",
            }}
          >
            Rank Buddies
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
              color: "#6B7280",
              marginTop: 2,
            }}
          >
            Review and rank your buddi applicants
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Coming Soon Section */}
        <View
          style={{
            backgroundColor: "#FFF7ED",
            borderRadius: 20,
            padding: 40,
            alignItems: "center",
            marginTop: 40,
            borderWidth: 2,
            borderColor: "#FF932E",
            borderStyle: "dashed",
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#FF932E",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <FontAwesome5 name="users" size={36} color="#fff" />
          </View>

          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 22,
              color: "#1F2937",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Coming Soon!
          </Text>

          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 16,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 24,
              marginBottom: 24,
            }}
          >
            The ranking system for buddi applicants is currently under
            development. You'll be able to review profiles, ratings, and choose
            the best buddi for your children.
          </Text>

          {/* Feature Preview */}
          <View style={{ width: "100%", marginBottom: 24 }}>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#FF932E",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              What's Coming:
            </Text>

            <View style={{ gap: 12 }}>
              {[
                "📱 Review buddi profiles and ratings",
                "⭐ Rate and rank applicants",
                "💬 Chat with potential buddis",
                "✅ Make informed decisions",
                "🔄 Easy applicant management",
              ].map((feature, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "#FFE4CC",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 14,
                      color: "#374151",
                      flex: 1,
                    }}
                  >
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 20,
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#FF932E",
              }}
              onPress={handleBackPress}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                  color: "#FF932E",
                }}
              >
                Go Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#FF932E",
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 20,
                alignItems: "center",
              }}
              onPress={() => {
                // TODO: Navigate to notifications or settings
                console.log("Get notified when ranking is ready");
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                Get Notified
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View
          style={{
            backgroundColor: "#F8FAFC",
            borderRadius: 16,
            padding: 20,
            marginTop: 24,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <MaterialIcons
              name="info"
              size={20}
              color="#FF932E"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#1F2937",
              }}
            >
              How It Works
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
              color: "#6B7280",
              lineHeight: 20,
            }}
          >
            Once the ranking system is live, you'll receive notifications when
            buddis apply for your pickup requests. You can then review their
            profiles, ratings, and experience to make the best choice for your
            family.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RankBuddiesPage;
