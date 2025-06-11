import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface BuddiInfo {
  image: string;
  name: string;
  gender?: string;
  email: string;
  age: string;
  phone: string;
  school: string;
  schoolName: string;
}

interface ReferenceInfo {
  image: string;
  name: string;
  phone: string;
  role: string;
}

interface AdminBuddiApplicationCardProps {
  buddi: BuddiInfo;
  reference: ReferenceInfo;
  status: string;
  onViewDetails: () => void;
  onApprove: () => void;
  approved: boolean;
}

const AdminBuddiApplicationCard: React.FC<AdminBuddiApplicationCardProps> = ({
  buddi,
  reference,
  status,
  onViewDetails,
  onApprove,
  approved,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Buddi Application</Text>
          <Text style={styles.headerSub}>Click on a buddi to view details</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={22} color="#BDBDBD" />
      </View>
      {/* Status */}
      <View style={styles.statusRow}>
        <Text style={styles.sectionLabel}>Buddi</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      {/* Buddi Info */}
      <View style={styles.buddiRow}>
        <Image source={{ uri: buddi.image }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.buddiName}>{buddi.name} {buddi.gender && `(${buddi.gender})`}</Text>
          <Text style={styles.buddiEmail}>{buddi.email}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.buddiAgeLabel}>Age</Text>
          <Text style={styles.buddiAge}>{buddi.age}</Text>
        </View>
      </View>
      {/* School & Phone */}
      <View style={styles.schoolRow}>
        <MaterialIcons name="school" size={22} color="#3B82F6" style={{ marginRight: 8 }} />
        <Text style={styles.schoolName}>{buddi.schoolName}</Text>
        <Ionicons name="call" size={18} color="#23272F" style={{ marginLeft: 18, marginRight: 6 }} />
        <Text style={styles.buddiPhone}>{buddi.phone}</Text>
      </View>
      {/* Reference */}
      <View style={styles.referenceRow}>
        <Text style={styles.sectionLabel}>Reference</Text>
        <Text style={styles.referenceRole}>{reference.role}</Text>
      </View>
      <View style={styles.buddiRow}>
        <Image source={{ uri: reference.image }} style={styles.avatarSmall} />
        <View style={{ flex: 1 }}>
          <Text style={styles.buddiName}>{reference.name}</Text>
        </View>
        <Ionicons name="call" size={18} color="#23272F" style={{ marginRight: 6 }} />
        <Text style={styles.buddiPhone}>{reference.phone}</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#FF932E" style={{ marginLeft: 10 }} />
      </View>
      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.detailsBtn} onPress={onViewDetails}>
          <Text style={styles.detailsBtnText}>View Details</Text>
          <Ionicons name="arrow-forward" size={18} color="#23272F" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.approveBtn, approved && styles.approveBtnActive]} onPress={onApprove}>
          <Text style={styles.approveBtnText}>Approve</Text>
          {approved && (
            <Ionicons name="checkmark" size={18} color="#fff" style={{ marginLeft: 6 }} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    margin: 12,
    shadowColor: "#23272F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  headerSub: {
    fontSize: 13,
    color: "#BDBDBD",
    fontFamily: "Comfortaa-Regular",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    color: "#23272F",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  statusBadge: {
    backgroundColor: "#EAF2FF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  statusText: {
    color: "#3B82F6",
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  buddiRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  buddiName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  buddiEmail: {
    fontSize: 13,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
  },
  buddiAgeLabel: {
    fontSize: 13,
    color: "#8A8A8A",
    fontFamily: "Comfortaa-Regular",
    textAlign: "right",
  },
  buddiAge: {
    fontSize: 15,
    color: "#23272F",
    fontWeight: "600",
    fontFamily: "Comfortaa-Regular",
    textAlign: "right",
  },
  schoolRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 48,
  },
  schoolName: {
    fontSize: 13,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
    marginRight: 8,
  },
  buddiPhone: {
    fontSize: 13,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  referenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 2,
  },
  referenceRole: {
    fontSize: 13,
    color: "#3B82F6",
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  detailsBtnText: {
    color: "#23272F",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
  approveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF932E",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 28,
    opacity: 0.7,
  },
  approveBtnActive: {
    opacity: 1,
  },
  approveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Comfortaa-Regular",
  },
});

export default AdminBuddiApplicationCard; 