import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/commons/PageHeader";

const tokenPackages = [
  {
    range: "1 - 5 Tokens",
    price: 35,
    oldPrice: 40,
    discount: "Save $5/token!",
    description: "Perfect for trying out Buddi services.",
    icon: "star-outline",
    gradient: ["#FF932E", "#FFB86C"],
  },
  {
    range: "6 - 10 Tokens",
    price: 33,
    oldPrice: 40,
    discount: "Save $7/token!",
    description: "Best for regular users.",
    icon: "flame-outline",
    gradient: ["#34D399", "#06B6D4"],
  },
  {
    range: "11+ Tokens",
    price: 30,
    oldPrice: 40,
    discount: "Save $10/token!",
    description: "Unlock the best value for your family!",
    icon: "diamond-outline",
    gradient: ["#8B5CF6", "#3B82F6"],
  },
];

const BuyTokens = () => {
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
        contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: 32, paddingHorizontal: 0 }}>
          <PageHeader title="Buy Tokens" />
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 24,
              color: "#232B3A",
              marginTop: 18,
              marginBottom: 8,
              paddingHorizontal: 18,
            }}
          >
            Choose Your Token Package
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 15,
              color: "#71727A",
              marginBottom: 18,
              paddingHorizontal: 18,
            }}
          >
            Get more rides and features for your family. The more you buy, the
            more you save!
          </Text>
          {tokenPackages.map((pkg, idx) => (
            <LinearGradient
              key={pkg.range}
              colors={pkg.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 18,
                marginBottom: 22,
                padding: 22,
                shadowColor: pkg.gradient[0],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.13,
                shadowRadius: 12,
                elevation: 4,
                width: "92%",
                alignSelf: "center",
                minWidth: 320,
                maxWidth: 480,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.18)",
                    borderRadius: 999,
                    padding: 14,
                    marginRight: 14,
                    borderWidth: 2,
                    borderColor: "#fff",
                  }}
                >
                  <Ionicons name={pkg.icon as any} size={32} color="#fff" />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 18,
                      flexWrap: "wrap",
                    }}
                  >
                    {pkg.range}
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 14,
                      marginTop: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    {pkg.description}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", minWidth: 90 }}>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 999,
                      paddingVertical: 4,
                      paddingHorizontal: 14,
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: pkg.gradient[0],
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 15,
                      }}
                    >
                      {pkg.discount}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 15,
                      textDecorationLine: "line-through",
                      opacity: 0.7,
                    }}
                  >
                    ${pkg.oldPrice}/token
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 22,
                      marginTop: -2,
                    }}
                  >
                    ${pkg.price}
                    <Text
                      style={{ fontSize: 15, fontFamily: "Comfortaa-Regular" }}
                    >
                      /token
                    </Text>
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 999,
                  paddingVertical: 13,
                  paddingHorizontal: 32,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: pkg.gradient[0],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 2,
                  marginTop: 10,
                }}
                activeOpacity={0.85}
                onPress={() => {}}
              >
                <FontAwesome5
                  name="wallet"
                  size={18}
                  color={pkg.gradient[0]}
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    color: pkg.gradient[0],
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 16,
                  }}
                >
                  Buy Now
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BuyTokens;
