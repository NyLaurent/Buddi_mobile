import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/commons/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { getTokenBalance } from "../../services/payments";

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
  const { parentDetails } = useAuth();
  const parentId = parentDetails?.id;
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<
    (typeof tokenPackages)[0] | null
  >(null);
  const [quantity, setQuantity] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);

  // Helper to get max quantity for selected package
  const getMaxQuantity = (pkg: (typeof tokenPackages)[0] | null) => {
    if (!pkg) return undefined;
    if (pkg.range === "1 - 5 Tokens") return 5;
    if (pkg.range === "6 - 10 Tokens") return 10;
    return undefined; // 11+ Tokens: no max
  };

  const fetchBalance = async () => {
    if (!parentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getTokenBalance(parentId);
      setBalance(res.tokens);
    } catch (err: any) {
      // Handle 404 error gracefully - no tokens means 0 balance
      if (err?.response?.status === 404 || err?.message?.includes("404")) {
        setBalance(0);
        setError(null);
      } else {
        setError(err.message || "Failed to fetch token balance");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId]);

  const openModal = (pkg: (typeof tokenPackages)[0]) => {
    setSelectedPkg(pkg);
    setInputError(null);
    // Default quantity based on package
    if (pkg.range === "1 - 5 Tokens") setQuantity("5");
    else if (pkg.range === "6 - 10 Tokens") setQuantity("10");
    else if (pkg.range === "11+ Tokens") setQuantity("11");
    else setQuantity("1");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPkg(null);
    setQuantity("");
    setInputError(null);
  };

  const handleQuantityChange = (val: string) => {
    // Only allow numbers
    const num = val.replace(/[^0-9]/g, "");
    const max = getMaxQuantity(selectedPkg);
    if (max !== undefined && num) {
      if (parseInt(num, 10) > max) {
        setInputError(`Maximum allowed is ${max}`);
        setQuantity(String(max));
        return;
      } else {
        setInputError(null);
      }
    } else {
      setInputError(null);
    }
    setQuantity(num);
  };

  const handleModalBuy = async () => {
    if (!selectedPkg || !parentId) return;
    const qty = parseInt(quantity, 10);
    const max = getMaxQuantity(selectedPkg);
    if (!qty || qty < 1) {
      setInputError("Please enter a valid quantity.");
      return;
    }
    if (max !== undefined && qty > max) {
      setInputError(`Maximum allowed is ${max}`);
      return;
    }
    setModalVisible(false);
    setInputError(null);
    await handleBuy(selectedPkg, qty);
  };

  // Modified handleBuy to redirect to web app
  const handleBuy = async (
    pkg: (typeof tokenPackages)[0],
    qtyOverride?: number
  ) => {
    if (!parentId) return;
    setBuying(true);
    setError(null);
    setSuccessMsg(null);
    const quantity =
      qtyOverride ??
      (pkg.range === "1 - 5 Tokens"
        ? 5
        : pkg.range === "6 - 10 Tokens"
        ? 10
        : 11);

    try {
      // Redirect to web app for payment
      const webAppUrl = "https://app.pickupbuddi.com";
      const supported = await Linking.canOpenURL(webAppUrl);
      if (supported) {
        await Linking.openURL(webAppUrl);
        setSuccessMsg(
          "Redirecting to our web app to complete your token purchase securely."
        );
      } else {
        setError("Unable to open web app. Please visit the website manually.");
      }
    } catch (err: any) {
      setError("Failed to redirect to web app. Please try again.");
    } finally {
      setBuying(false);
    }
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
            more you save! All payments are securely processed on our web app.
          </Text>
          {/* Token Balance */}
          <View style={{ paddingHorizontal: 18, marginBottom: 18 }}>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 16,
                color: "#232B3A",
              }}
            >
              Your Token Balance:
            </Text>
            {loading ? (
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 16,
                  color: "#71727A",
                  marginTop: 4,
                }}
              >
                Loading...
              </Text>
            ) : error ? (
              <Text
                style={{
                  color: "#FF3B30",
                  fontFamily: "Comfortaa-Regular",
                  marginTop: 4,
                }}
              >
                {error}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 28,
                  color: "#FF932E",
                  marginTop: 4,
                }}
              >
                {balance ?? 0}
              </Text>
            )}
            {!loading && !error && (balance === 0 || balance === null) && (
              <Text
                style={{
                  color: "#71727A",
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 14,
                  marginTop: 4,
                }}
              >
                You have no tokens yet. Buy some to get started!
              </Text>
            )}
            {successMsg && (
              <Text
                style={{
                  color: "#34C759",
                  fontFamily: "Comfortaa-Regular",
                  marginTop: 4,
                }}
              >
                {successMsg}
              </Text>
            )}
          </View>
          {tokenPackages.map((pkg, idx) => (
            <LinearGradient
              key={pkg.range}
              colors={pkg.gradient as any}
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
                  opacity: buying ? 0.7 : 1,
                }}
                activeOpacity={0.85}
                onPress={() => openModal(pkg)}
                disabled={buying}
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
                  {buying ? "Processing..." : "Buy Now"}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}

          {/* Buy Modal */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={closeModal}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 18,
                  padding: 28,
                  width: 320,
                  maxHeight: "80%",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <TouchableOpacity
                  onPress={closeModal}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 1,
                  }}
                >
                  <Ionicons name="close" size={24} color="#71727A" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 20,
                    color: "#232B3A",
                    marginBottom: 8,
                    marginTop: 8,
                  }}
                >
                  Buy Tokens
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 14,
                    color: "#71727A",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  You&apos;ll be redirected to our web app for secure payment
                  processing
                </Text>
                {selectedPkg && (
                  <>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 16,
                        color: selectedPkg.gradient[0],
                        marginBottom: 8,
                      }}
                    >
                      {selectedPkg.range}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 15,
                        color: "#71727A",
                        marginBottom: 12,
                      }}
                    >
                      {selectedPkg.description}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 15,
                        color: "#232B3A",
                        marginBottom: 4,
                      }}
                    >
                      Enter Quantity:
                    </Text>
                    <TextInput
                      value={quantity}
                      onChangeText={handleQuantityChange}
                      keyboardType="number-pad"
                      style={{
                        borderWidth: 1,
                        borderColor: inputError ? "#FF3B30" : "#e9ecef",
                        borderRadius: 8,
                        padding: 10,
                        width: 120,
                        fontFamily: "Comfortaa-Bold",
                        fontSize: 18,
                        textAlign: "center",
                        marginBottom: 6,
                      }}
                      placeholder="Quantity"
                      editable={!buying}
                    />
                    {selectedPkg &&
                      getMaxQuantity(selectedPkg) !== undefined && (
                        <Text
                          style={{
                            fontFamily: "Comfortaa-Regular",
                            fontSize: 13,
                            color: "#71727A",
                            marginBottom: 4,
                          }}
                        >
                          Max: {getMaxQuantity(selectedPkg)}
                        </Text>
                      )}
                    {inputError && (
                      <Text
                        style={{
                          color: "#FF3B30",
                          fontFamily: "Comfortaa-Regular",
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        {inputError}
                      </Text>
                    )}
                    <Text
                      style={{
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 15,
                        color: "#232B3A",
                        marginBottom: 16,
                      }}
                    >
                      Total:{" "}
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Bold",
                          color: selectedPkg.gradient[0],
                          fontSize: 18,
                        }}
                      >
                        $
                        {quantity && !isNaN(Number(quantity))
                          ? Number(quantity) * selectedPkg.price
                          : 0}
                      </Text>
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: selectedPkg.gradient[0],
                        borderRadius: 8,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        width: "100%",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                      onPress={handleModalBuy}
                      disabled={buying}
                    >
                      <Text
                        style={{
                          fontFamily: "Comfortaa-Bold",
                          color: "#fff",
                          fontSize: 14,
                        }}
                      >
                        {buying ? "Redirecting..." : "Continue to Web App"}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BuyTokens;
