import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PageHeader from "../../components/commons/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { ChildrenService, CoverageService } from "../../services/api";

export default function CallPage() {
  const [description, setDescription] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [pickupTime, setPickupTime] = useState("");
  const [kidsCount, setKidsCount] = useState("");
  const [fromZone, setFromZone] = useState("");
  const [toZone, setToZone] = useState("");

  // Modal state
  const [showKidModal, setShowKidModal] = useState(false);
  const [kidName, setKidName] = useState("");
  const [kidAge, setKidAge] = useState("");
  const [kidSchool, setKidSchool] = useState("");
  const [kidPickupAddress, setKidPickupAddress] = useState("");

  const { parentDetails } = useAuth();
  const [registeredKids, setRegisteredKids] = useState<
    import("../../services/api/children.service").Child[]
  >([]);
  const [kidsLoading, setKidsLoading] = useState(false);
  const [kidsError, setKidsError] = useState<string | null>(null);

  const [kidLoading, setKidLoading] = useState(false);
  const [kidError, setKidError] = useState<string | null>(null);

  const [pickupLoading, setPickupLoading] = useState(false);
  const [pickupError, setPickupError] = useState<string | null>(null);
  const [pickupSuccess, setPickupSuccess] = useState<string | null>(null);

  const [selectedChildId, setSelectedChildId] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const toggleDay = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSaveKid = async () => {
    setKidError(null);
    if (!parentDetails?.id) {
      setKidError("Parent not found. Please log in again.");
      return;
    }
    if (!kidName || !kidAge || !kidSchool || !kidPickupAddress) {
      setKidError("Please fill all fields.");
      return;
    }
    setKidLoading(true);
    try {
      await ChildrenService.registerChild({
        parentId: parentDetails.id.toString(),
        name: kidName,
        age: Number(kidAge),
        schoolName: kidSchool,
        pickupAddress: kidPickupAddress,
      });
      setShowKidModal(false);
      setKidName("");
      setKidAge("");
      setKidSchool("");
      setKidPickupAddress("");
      Alert.alert("Success", "Kid registered successfully!");
      handleKidRegistered();
    } catch (err: any) {
      let message = "Failed to register kid.";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes("Network")) {
          message =
            "Network error. Please check your connection and try again.";
        } else if (err.message.includes("timeout")) {
          message = "Request timed out. Please try again.";
        } else {
          message = err.message;
        }
      } else if (typeof err === "string") {
        message = err;
      }
      setKidError(message);
    } finally {
      setKidLoading(false);
    }
  };

  const handleCreatePickup = async () => {
    setPickupError(null);
    setPickupSuccess(null);
    if (!parentDetails?.id) {
      setPickupError("Parent not found. Please log in again.");
      return;
    }
    if (!selectedChildId) {
      setPickupError("Please select a kid for the pickup.");
      return;
    }
    if (
      !description ||
      !availableDays.length ||
      !pickupTime ||
      !kidsCount ||
      !fromZone ||
      !toZone
    ) {
      setPickupError("Please fill all required fields.");
      return;
    }
    setPickupLoading(true);
    try {
      await CoverageService.createPickupRequest({
        parentId: parentDetails.id.toString(),
        childId: selectedChildId,
        description,
        availableDays,
        pickupTime,
        kidsCount: Number(kidsCount),
        fromZone,
        toZone,
      });
      setPickupSuccess("Pickup request created successfully!");
      setDescription("");
      setAvailableDays([]);
      setPickupTime("");
      setKidsCount("");
      setFromZone("");
      setToZone("");
      setSelectedChildId("");
    } catch (err: any) {
      let message = "Failed to create pickup request.";
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        if (err.message.includes("Network")) {
          message =
            "Network error. Please check your connection and try again.";
        } else if (err.message.includes("timeout")) {
          message = "Request timed out. Please try again.";
        } else {
          message = err.message;
        }
      } else if (typeof err === "string") {
        message = err;
      }
      setPickupError(message);
    } finally {
      setPickupLoading(false);
    }
  };

  const fetchRegisteredKids = async () => {
    if (!parentDetails?.id) return;
    setKidsLoading(true);
    setKidsError(null);
    try {
      const kids = await ChildrenService.getChildrenByParent(
        parentDetails.id.toString()
      );
      setRegisteredKids(Array.isArray(kids) ? kids : []);
    } catch (err: any) {
      setKidsError(err.message || "Failed to fetch registered kids.");
      setRegisteredKids([]); // Defensive: avoid undefined
    } finally {
      setKidsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredKids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentDetails?.id]);

  // Call this after successful registration
  const handleKidRegistered = () => {
    fetchRegisteredKids();
  };

  // For time picker, use a simple text input for now (can be replaced with a picker later)
  // Time picker handler
  const handleTimeChange = (event: any, selectedDate?: Date | undefined) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      // Format to HH:mm
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      setPickupTime(`${hours}:${minutes}`);
    }
  };

  // Debug: log registeredKids before rendering
  console.log("registeredKids (before render):", registeredKids);

  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: "#F6F7FB" }}>
      {/* Kid Registration Modal */}
      <Modal
        visible={showKidModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowKidModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(44, 44, 84, 0.18)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "88%",
              backgroundColor: "#fff",
              borderRadius: 22,
              padding: 24,
              shadowColor: "#FB8500",
              shadowOpacity: 0.1,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}
          >
            {/* Close Icon */}
            <Pressable
              style={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}
              onPress={() => setShowKidModal(false)}
              hitSlop={12}
            >
              <Ionicons name="close" size={26} color="#FB8500" />
            </Pressable>
            <Text
              style={{
                fontFamily: "Comfortaa-Bold",
                fontSize: 20,
                color: "#232B3A",
                textAlign: "center",
                marginBottom: 18,
                marginTop: 2,
              }}
            >
              Register a Kid
            </Text>
            {/* Kid Name */}
            <Text
              style={{
                fontFamily: "Comfortaa-Medium",
                fontSize: 15,
                color: "#232B3A",
                marginBottom: 6,
              }}
            >
              Name
            </Text>
            <TextInput
              value={kidName}
              onChangeText={setKidName}
              placeholder="e.g. Keza"
              placeholderTextColor="#BDBDBD"
              style={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                padding: 12,
                marginBottom: 14,
                backgroundColor: "#F9FAFB",
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                color: "#232B3A",
              }}
            />
            {/* Kid Age */}
            <Text
              style={{
                fontFamily: "Comfortaa-Medium",
                fontSize: 15,
                color: "#232B3A",
                marginBottom: 6,
              }}
            >
              Age
            </Text>
            <TextInput
              value={kidAge}
              onChangeText={setKidAge}
              placeholder="e.g. 7"
              placeholderTextColor="#BDBDBD"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                padding: 12,
                marginBottom: 14,
                backgroundColor: "#F9FAFB",
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                color: "#232B3A",
              }}
            />
            {/* School Name */}
            <Text
              style={{
                fontFamily: "Comfortaa-Medium",
                fontSize: 15,
                color: "#232B3A",
                marginBottom: 6,
              }}
            >
              School Name
            </Text>
            <TextInput
              value={kidSchool}
              onChangeText={setKidSchool}
              placeholder="e.g. ABC Primary School"
              placeholderTextColor="#BDBDBD"
              style={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                padding: 12,
                marginBottom: 14,
                backgroundColor: "#F9FAFB",
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                color: "#232B3A",
              }}
            />
            {/* Pickup Address */}
            <Text
              style={{
                fontFamily: "Comfortaa-Medium",
                fontSize: 15,
                color: "#232B3A",
                marginBottom: 6,
              }}
            >
              Pickup Address
            </Text>
            <TextInput
              value={kidPickupAddress}
              onChangeText={setKidPickupAddress}
              placeholder="e.g. 123 School Road"
              placeholderTextColor="#BDBDBD"
              style={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                padding: 12,
                marginBottom: 18,
                backgroundColor: "#F9FAFB",
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                color: "#232B3A",
              }}
            />
            {/* Save Button */}
            {kidError ? (
              <Text
                style={{
                  color: "red",
                  fontSize: 13,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                {kidError}
              </Text>
            ) : null}
            <TouchableOpacity
              style={{
                backgroundColor: kidLoading ? "#FBBF24" : "#FB8500",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                marginTop: 2,
                shadowColor: "#FB8500",
                shadowOpacity: 0.12,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                opacity: kidLoading ? 0.7 : 1,
              }}
              onPress={handleSaveKid}
              activeOpacity={0.85}
              disabled={kidLoading}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Medium",
                  fontSize: 16,
                }}
              >
                {kidLoading ? "Registering..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader title="Request a Pickup" />
        {/* Registered Kids Card or CTA Card */}
        {kidsLoading ? (
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 8,
              marginBottom: 0,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Comfortaa-Medium",
                fontSize: 15,
                color: "#232B3A",
                marginVertical: 16,
              }}
            >
              Loading your registered kids...
            </Text>
          </View>
        ) : Array.isArray(registeredKids) && registeredKids.length > 0 ? (
          <View style={{ marginHorizontal: 16, marginTop: 8, marginBottom: 0 }}>
            <LinearGradient
              colors={["#FFB347", "#FB8500"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 20,
                shadowColor: "#FB8500",
                shadowOpacity: 0.15,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 18,
                  color: "#fff",
                  marginBottom: 14,
                  letterSpacing: 0.5,
                }}
              >
                One of your registered kids
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(255,255,255,0.92)",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="person-circle"
                  size={44}
                  color="#FB8500"
                  style={{ marginRight: 16 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Bold",
                      fontSize: 16,
                      color: "#FB8500",
                      marginBottom: 2,
                    }}
                  >
                    {registeredKids[0].name}{" "}
                    <Text
                      style={{
                        color: "#6B7280",
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 13,
                      }}
                    >
                      (Age: {registeredKids[0].age})
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 14,
                      color: "#232B3A",
                      marginTop: 2,
                    }}
                  >
                    <Ionicons name="school" size={14} color="#FB8500" /> School:{" "}
                    <Text style={{ color: "#FB8500" }}>
                      {registeredKids[0].schoolName}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Regular",
                      fontSize: 14,
                      color: "#232B3A",
                      marginTop: 2,
                    }}
                  >
                    <Ionicons name="location" size={14} color="#FB8500" />{" "}
                    Pickup Address:{" "}
                    <Text style={{ color: "#FB8500" }}>
                      {registeredKids[0].pickupAddress}
                    </Text>
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 4,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    shadowColor: "#FB8500",
                    shadowOpacity: 0.12,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    marginRight: 6,
                  }}
                  onPress={() => setShowKidModal(true)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={{
                      color: "#FB8500",
                      fontFamily: "Comfortaa-Medium",
                      fontSize: 15,
                    }}
                  >
                    Add More
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    shadowColor: "#FB8500",
                    shadowOpacity: 0.12,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                  onPress={() => router.push("/parent/all-kids")}
                  activeOpacity={0.85}
                >
                  <Text
                    style={{
                      color: "#FB8500",
                      fontFamily: "Comfortaa-Medium",
                      fontSize: 15,
                    }}
                  >
                    See More
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        ) : kidsError ? (
          <View
            style={{
              marginHorizontal: 16,
              marginTop: 8,
              marginBottom: 0,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "red",
                fontSize: 14,
                fontFamily: "Comfortaa-Medium",
                marginVertical: 16,
              }}
            >
              {kidsError}
            </Text>
          </View>
        ) : (
          <View style={{ marginHorizontal: 16, marginTop: 8, marginBottom: 0 }}>
            <View
              style={{
                backgroundColor: "#FFF4E5", // soft orange
                borderRadius: 16,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#FB8500",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              <MaterialIcons
                name="info"
                size={28}
                color="#FB8500"
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Bold",
                    fontSize: 15,
                    color: "#232B3A",
                    marginBottom: 2,
                  }}
                >
                  Haven&apos;t registered your kids yet?
                </Text>
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 13,
                    color: "#FB8500",
                    marginBottom: 4,
                  }}
                >
                  Please register at least one kid before creating a pickup
                  request.
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#FB8500",
                  borderRadius: 10,
                  paddingVertical: 7,
                  paddingHorizontal: 14,
                  marginLeft: 8,
                }}
                onPress={() => setShowKidModal(true)}
                activeOpacity={0.85}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Comfortaa-Medium",
                    fontSize: 14,
                  }}
                >
                  Register a Kid
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* Top Banner with Image */}
        <View
          style={{ alignItems: "center", paddingTop: 32, paddingBottom: 12 }}
        >
          <Image
            source={require("../../assets/images/onboarding/onboarding_1.png")}
            style={{
              width: 180,
              height: 120,
              resizeMode: "contain",
              marginBottom: 8,
            }}
          />
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 22,
              color: "#232B3A",
              marginBottom: 2,
            }}
          >
            Request a Pickup
          </Text>
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 14,
              color: "#6B7280",
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            Fill in the details below to request a Buddi for your kids school
            pickup.
          </Text>
        </View>
        {/* Card Container */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            margin: 16,
            padding: 20,
          }}
        >
          {/* Success/Error Message */}
          {pickupSuccess ? (
            <Text
              style={{
                color: "green",
                fontSize: 15,
                fontFamily: "Comfortaa-Medium",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {pickupSuccess}
            </Text>
          ) : null}
          {pickupError ? (
            <Text
              style={{
                color: "red",
                fontSize: 14,
                fontFamily: "Comfortaa-Medium",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {pickupError}
            </Text>
          ) : null}
          {/* Child Picker */}
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#232B3A",
              marginBottom: 8,
            }}
          >
            Select Kid
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 12,
              marginBottom: 18,
              backgroundColor: "#F9FAFB",
            }}
          >
            {registeredKids.length > 0 ? (
              <>
                {registeredKids.map((kid) => (
                  <TouchableOpacity
                    key={kid.id}
                    onPress={() => setSelectedChildId(kid.id)}
                    style={{
                      padding: 12,
                      backgroundColor:
                        selectedChildId === kid.id ? "#4f46e5" : "transparent",
                      borderRadius: 12,
                      marginBottom: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: selectedChildId === kid.id ? "#fff" : "#232B3A",
                        fontFamily: "Comfortaa-Regular",
                        fontSize: 15,
                      }}
                    >
                      {kid.name} (Age: {kid.age})
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <Text
                style={{
                  color: "#6B7280",
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 14,
                  padding: 12,
                }}
              >
                No kids registered yet.
              </Text>
            )}
          </View>
          {/* Description */}
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#232B3A",
              marginBottom: 8,
            }}
          >
            Pickup Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Morning pickup for school"
            placeholderTextColor="#BDBDBD"
            style={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 12,
              padding: 12,
              marginBottom: 18,
              backgroundColor: "#F9FAFB",
              fontFamily: "Comfortaa-Regular",
              fontSize: 15,
              color: "#232B3A",
            }}
          />
          {/* Available Days */}
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#232B3A",
              marginBottom: 8,
            }}
          >
            Available Days
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 18 }}
          >
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => toggleDay(day)}
                style={{
                  paddingVertical: 7,
                  paddingHorizontal: 16,
                  borderRadius: 18,
                  backgroundColor: availableDays.includes(day)
                    ? "#4f46e5"
                    : "#F3F4F6",
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: availableDays.includes(day) ? 0 : 1,
                  borderColor: "#E0E0E0",
                  shadowColor: availableDays.includes(day)
                    ? "#4f46e5"
                    : "transparent",
                  shadowOpacity: availableDays.includes(day) ? 0.12 : 0,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                }}
                activeOpacity={0.85}
              >
                <Text
                  style={{
                    fontFamily: "Comfortaa-Regular",
                    color: availableDays.includes(day) ? "#fff" : "#232B3A",
                    fontSize: 14,
                  }}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Pickup Time */}
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#232B3A",
              marginBottom: 8,
            }}
          >
            Pickup Time
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <MaterialIcons
              name="access-time"
              size={20}
              color="#4f46e5"
              style={{ marginRight: 8 }}
            />
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                padding: 12,
                backgroundColor: "#F9FAFB",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
              activeOpacity={0.85}
            >
              <Text
                style={{
                  fontFamily: "Comfortaa-Regular",
                  fontSize: 15,
                  color: pickupTime ? "#232B3A" : "#BDBDBD",
                }}
              >
                {pickupTime
                  ? `Selected Time: ${pickupTime}`
                  : "Select Pickup Time"}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={
                  pickupTime
                    ? (() => {
                        const [h, m] = pickupTime.split(":");
                        const d = new Date();
                        d.setHours(Number(h));
                        d.setMinutes(Number(m));
                        d.setSeconds(0);
                        d.setMilliseconds(0);
                        return d;
                      })()
                    : new Date()
                }
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
          {/* Kids Count */}
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#232B3A",
              marginBottom: 8,
            }}
          >
            Number of Kids
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <MaterialIcons
              name="child-care"
              size={20}
              color="#4f46e5"
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={kidsCount}
              onChangeText={setKidsCount}
              placeholder="2"
              placeholderTextColor="#BDBDBD"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 12,
                padding: 12,
                backgroundColor: "#F9FAFB",
                fontFamily: "Comfortaa-Regular",
                fontSize: 15,
                color: "#232B3A",
                flex: 1,
              }}
            />
          </View>
          {/* From Zone (free text) */}
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#232B3A",
              marginBottom: 8,
            }}
          >
            From Zone
          </Text>
          <TextInput
            value={fromZone}
            onChangeText={setFromZone}
            placeholder="Enter pickup zone"
            placeholderTextColor="#BDBDBD"
            style={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 12,
              padding: 12,
              marginBottom: 18,
              backgroundColor: "#F9FAFB",
              fontFamily: "Comfortaa-Regular",
              fontSize: 15,
              color: "#232B3A",
            }}
          />
          {/* To Zone (free text) */}
          <Text
            style={{
              fontFamily: "Comfortaa-Bold",
              fontSize: 16,
              color: "#232B3A",
              marginBottom: 8,
            }}
          >
            To Zone
          </Text>
          <TextInput
            value={toZone}
            onChangeText={setToZone}
            placeholder="Enter drop-off zone"
            placeholderTextColor="#BDBDBD"
            style={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 12,
              padding: 12,
              marginBottom: 24,
              backgroundColor: "#F9FAFB",
              fontFamily: "Comfortaa-Regular",
              fontSize: 15,
              color: "#232B3A",
            }}
          />
          {/* Submit Button */}
          <TouchableOpacity
            style={{
              backgroundColor:
                registeredKids.length === 0 || pickupLoading
                  ? "#A0A0A0"
                  : "#4f46e5",
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: "center",
              opacity: registeredKids.length === 0 || pickupLoading ? 0.7 : 1,
              marginTop: 8,
              shadowColor: "#4f46e5",
              shadowOpacity: 0.15,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
            onPress={handleCreatePickup}
            disabled={registeredKids.length === 0 || pickupLoading}
            activeOpacity={0.85}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Comfortaa-Medium",
                fontSize: 17,
              }}
            >
              {pickupLoading ? "Submitting..." : "Submit Pickup Request"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
