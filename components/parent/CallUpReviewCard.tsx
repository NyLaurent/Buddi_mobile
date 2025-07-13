import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AssignedKid {
  name: string;
}

interface CallUpReviewCardProps {
  name: string;
  email: string;
  school: string;
  requestedAgo: string;
  description: string;
  schoolName: string;
  home: string;
  assignedKids: AssignedKid[];
  onViewDetails: () => void;
  onApplicants: () => void;
}

const CallUpReviewCard: React.FC<CallUpReviewCardProps> = ({
  name,
  email,
  school,
  requestedAgo,
  description,
  schoolName,
  home,
  assignedKids,
  onViewDetails,
  onApplicants,
}) => {
  return (
    <View className="bg-white rounded-2xl border border-gray px-4 py-5 my-3 w-full max-w-[420px] self-center">
      {/* Top: Name, School, Requested */}
      <View className="flex-row items-center justify-between mb-1">
        <View>
          <Text className="text-base font-comfortaa-bold text-grayText">
            {name}
          </Text>
          <Text className="text-xs text-grayText font-comfortaa mt-0.5">
            {email}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="school" size={16} color="#232B3A" />
          <Text className="text-xs text-grayText font-comfortaa ml-1">
            {school}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center mt-2 mb-2">
        <View className="bg-[#F4F7FE] rounded-lg px-2 py-1 flex-row items-center">
          <Ionicons name="checkmark-done" size={14} color="#3B82F6" />
          <Text className="text-xs text-blue font-comfortaa ml-1">
            Requested {requestedAgo}
          </Text>
        </View>
      </View>
      <View className="border-b border-gray my-2" />
      {/* Description */}
      <Text className="text-base font-comfortaa-bold text-gray-900 mb-1">
        Description
      </Text>
      <Text className="text-xs text-gray-500 font-comfortaa mb-3">
        {description}
      </Text>
      {/* School/Home Row */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="school" size={18} color="#22C55E" />
          <Text className="text-xs text-grayText font-comfortaa ml-1">
            School
          </Text>
          <Text className="text-sm font-comfortaa-bold text-grayText ml-1">
            {schoolName}
          </Text>
        </View>
        <Ionicons name="play" size={20} color="#60A5FA" />
        <View className="flex-row items-center">
          <MaterialIcons name="home" size={18} color="#FF9100" />
          <Text className="text-xs text-gray-400 font-comfortaa ml-1">
            Home
          </Text>
          <Text className="text-sm font-comfortaa-bold text-grayText ml-1">
            {home}
          </Text>
        </View>
      </View>
      {/* Assigned Kids */}
      <Text className="text-base font-comfortaa-bold text-gray-900 mb-2">
        Assigned Kids:
      </Text>
      <View className="flex-row items-center gap-4 mb-6 w-full">
        {assignedKids.map((kid, idx) => (
          <View key={idx} className="flex-row items-center gap-1">
            <FontAwesome name="child" size={22} color="#232B3A" />
            <Text className="text-base font-comfortaa text-gray-900">
              {kid.name}
            </Text>
          </View>
        ))}
      </View>
      {/* Action Buttons */}
      <View className="flex-row items-center justify-between mt-2">
        <TouchableOpacity
          className="flex-1 bg-[#F4F7FE] rounded-full py-3 items-center flex-row justify-center mr-2"
          onPress={onViewDetails}
        >
          <Ionicons name="eye" size={20} color="#6B7280" />
          <Text className="text-gray-500 font-comfortaa-bold text-base ml-2">
            View Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-[#FF9100] rounded-full py-3 items-center flex-row justify-center ml-2"
          onPress={onApplicants}
        >
          <Ionicons name="people" size={20} color="white" />
          <Text className="text-white font-comfortaa-bold text-base ml-2">
            Applicants
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CallUpReviewCard;
