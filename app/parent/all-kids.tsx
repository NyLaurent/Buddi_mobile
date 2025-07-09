import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
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
import { ChildrenService } from "../../services/api";

export default function AllKidsPage() {
  const { parentDetails } = useAuth();
  // Log parentDetails and parentDetails.id on mount and when parentDetails changes
  useEffect(() => {
    console.log("parentDetails from useAuth:", parentDetails);
    console.log("parentId used for API:", parentDetails?.id);
  }, [parentDetails]);
  const [kids, setKids] = useState<
    import("../../services/api/children.service").Child[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatingKid, setUpdatingKid] = useState<
    null | import("../../services/api/children.service").Child
  >(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    age: "",
    schoolName: "",
    pickupAddress: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const openUpdateModal = (kid: typeof updatingKid) => {
    setUpdatingKid(kid);
    setUpdateForm({
      name: kid?.name || "",
      age: kid?.age?.toString() || "",
      schoolName: kid?.schoolName || "",
      pickupAddress: kid?.pickupAddress || "",
    });
    setUpdateError(null);
    setUpdateModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!updatingKid || !parentDetails?.id) return;
    console.log("parentDetails before update:", parentDetails);
    console.log("parentId used for update API:", parentDetails.id);
    console.log("Updating kid:", {
      childId: updatingKid.id,
      parentId: parentDetails.id,
      payload: {
        name: updateForm.name,
        age: Number(updateForm.age),
        schoolName: updateForm.schoolName,
        pickupAddress: updateForm.pickupAddress,
      },
    });
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      await ChildrenService.updateChild(
        updatingKid.id,
        parentDetails.id.toString(),
        {
          name: updateForm.name,
          age: Number(updateForm.age),
          schoolName: updateForm.schoolName,
          pickupAddress: updateForm.pickupAddress,
        }
      );
      setUpdateModalVisible(false);
      setUpdatingKid(null);
      fetchKids();
      Alert.alert("Success", "Kid updated successfully!");
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update kid.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = (kidId: string) => {
    if (!parentDetails?.id) return;
    console.log("parentDetails before delete:", parentDetails);
    console.log("parentId used for delete API:", parentDetails.id);
    console.log("Deleting kid:", {
      childId: kidId,
      parentId: parentDetails.id,
    });
    Alert.alert("Delete Kid", "Are you sure you want to delete this kid?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeleteLoadingId(kidId);
          try {
            await ChildrenService.deleteChild(
              kidId,
              parentDetails.id.toString()
            );
            fetchKids();
            Alert.alert("Success", "Kid deleted successfully!");
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to delete kid.");
          } finally {
            setDeleteLoadingId(null);
          }
        },
      },
    ]);
  };

  const fetchKids = async () => {
    if (!parentDetails?.id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await ChildrenService.getChildrenByParent(
        parentDetails.id.toString()
      );
      setKids(Array.isArray(result) ? result : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch kids.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentDetails?.id]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFF4E5", paddingTop: 20 }}
    >
      <PageHeader title="All Kids" />
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <Text
          style={{
            fontFamily: "Comfortaa-Bold",
            fontSize: 22,
            color: "#FB8500",
            marginBottom: 18,
            textAlign: "center",
          }}
        >
          All Registered Kids
        </Text>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#FB8500"
            style={{ marginTop: 40 }}
          />
        ) : error ? (
          <Text
            style={{
              color: "red",
              fontFamily: "Comfortaa-Medium",
              fontSize: 16,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            {error}
          </Text>
        ) : kids.length === 0 ? (
          <Text
            style={{
              fontFamily: "Comfortaa-Regular",
              fontSize: 16,
              color: "#232B3A",
              textAlign: "center",
              marginTop: 40,
            }}
          >
            No kids registered yet.
          </Text>
        ) : (
          <View
            style={{
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: "#fff",
              // shadowColor: "#FB8500",
              // shadowOpacity: 0.08,
              // shadowRadius: 8,
              // shadowOffset: { width: 0, height: 2 },
              // elevation: 2,
            }}
          >
            {/* Table Header */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#FB8500",
                paddingVertical: 12,
                paddingHorizontal: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  flex: 2,
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 15,
                }}
              >
                Name
              </Text>
              <Text
                style={{
                  flex: 1,
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 15,
                }}
              >
                Age
              </Text>
              <Text
                style={{
                  flex: 2,
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 15,
                }}
              >
                School
              </Text>
              <Text
                style={{
                  flex: 2,
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 15,
                }}
              >
                Pickup Address
              </Text>
              <Text
                style={{
                  flex: 2,
                  color: "#fff",
                  fontFamily: "Comfortaa-Bold",
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                Actions
              </Text>
            </View>
            {/* Table Rows */}
            {kids.map((kid, idx) => (
              <View
                key={kid.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: idx % 2 === 0 ? "#FFF8F1" : "#fff",
                  paddingVertical: 14,
                  paddingHorizontal: 8,
                  borderBottomWidth: idx === kids.length - 1 ? 0 : 1,
                  borderColor: "#FFE0B2",
                }}
              >
                <View
                  style={{
                    flex: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="person-circle"
                    size={28}
                    color="#FB8500"
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      fontFamily: "Comfortaa-Medium",
                      fontSize: 15,
                      color: "#232B3A",
                    }}
                  >
                    {kid.name}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 15,
                    color: "#232B3A",
                    textAlign: "center",
                  }}
                >
                  {kid.age}
                </Text>
                <Text
                  style={{
                    flex: 2,
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 15,
                    color: "#FB8500",
                  }}
                >
                  {kid.schoolName}
                </Text>
                <Text
                  style={{
                    flex: 2,
                    fontFamily: "Comfortaa-Regular",
                    fontSize: 15,
                    color: "#6B7280",
                  }}
                >
                  {kid.pickupAddress}
                </Text>
                <View
                  style={{
                    flex: 2,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => openUpdateModal(kid)}
                    style={{
                      marginRight: 8,
                      backgroundColor: "#FFF4E5",
                      borderRadius: 8,
                      padding: 6,
                    }}
                  >
                    <Ionicons name="create-outline" size={20} color="#FB8500" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(kid.id)}
                    style={{
                      backgroundColor: "#FFF4E5",
                      borderRadius: 8,
                      padding: 6,
                    }}
                  >
                    {deleteLoadingId === kid.id ? (
                      <ActivityIndicator size="small" color="#FB8500" />
                    ) : (
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FB8500"
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      {/* Update Kid Modal */}
      <Modal
        visible={updateModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(44,44,84,0.18)",
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
            <Pressable
              style={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}
              onPress={() => setUpdateModalVisible(false)}
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
              Update Kid
            </Text>
            {/* Name */}
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
              value={updateForm.name}
              onChangeText={(v) => setUpdateForm((f) => ({ ...f, name: v }))}
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
            {/* Age */}
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
              value={updateForm.age}
              onChangeText={(v) => setUpdateForm((f) => ({ ...f, age: v }))}
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
              value={updateForm.schoolName}
              onChangeText={(v) =>
                setUpdateForm((f) => ({ ...f, schoolName: v }))
              }
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
              value={updateForm.pickupAddress}
              onChangeText={(v) =>
                setUpdateForm((f) => ({ ...f, pickupAddress: v }))
              }
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
            {/* Error */}
            {updateError ? (
              <Text
                style={{
                  color: "red",
                  fontSize: 13,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                {updateError}
              </Text>
            ) : null}
            {/* Save Button */}
            <TouchableOpacity
              style={{
                backgroundColor: updateLoading ? "#FBBF24" : "#FB8500",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                marginTop: 2,
                shadowColor: "#FB8500",
                shadowOpacity: 0.12,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                opacity: updateLoading ? 0.7 : 1,
              }}
              onPress={handleUpdate}
              activeOpacity={0.85}
              disabled={updateLoading}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Comfortaa-Medium",
                  fontSize: 16,
                }}
              >
                {updateLoading ? "Updating..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
