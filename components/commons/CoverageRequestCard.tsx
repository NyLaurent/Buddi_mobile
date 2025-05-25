import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CoverageRequestCardProps {
  studentName: string;
  time: string;
  hourlyRate: string;
  school: string;
  home: string;
  requesterName: string;
  requesterEmail: string;
  requesterAvatar?: string;
  onViewDetails: () => void;
  onAccept: () => void;
}

const CoverageRequestCard = ({
  studentName,
  time,
  hourlyRate,
  school,
  home,
  requesterName,
  requesterEmail,
  requesterAvatar,
  onViewDetails,
  onAccept,
}: CoverageRequestCardProps) => (
  <View className="bg-white rounded-3xl p-4 mb-4 border border-gray-200 w-80">
    {/* Header */}
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-3">
        <View className="w-8 h-8 bg-gray-800 rounded-full items-center justify-center">
          <Ionicons name="person" size={16} color="white" />
        </View>
        <Text className="font-comfortaa-bold text-lg text-gray-900">
          {studentName}
        </Text>
      </View>
    </View>

    {/* Time and Rate */}
    <View className="flex-row items-center justify-between mb-6">
      <View className="bg-primary rounded-2xl px-4 py-2 flex-row items-center gap-2">
        <Ionicons name="time" size={16} color="white" />
        <Text className="text-white font-comfortaa-bold text-sm">{time}</Text>
      </View>
      <Text className="font-comfortaa-bold text-lg text-gray-700">
        {hourlyRate}
      </Text>
    </View>

    {/* Route */}
    <View className="flex-row items-center justify-between mb-6">
      <View className="flex-row items-center gap-2">
        <View className="w-3 h-3 bg-green-500 rounded-full" />
        <View>
          <Text className="text-gray-500 font-comfortaa text-xs">School</Text>
          <Text className="font-comfortaa text-gray-900 text-sm">{school}</Text>
        </View>
      </View>

      <TouchableOpacity className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
        <Ionicons name="play" size={20} color="white" />
      </TouchableOpacity>

      <View className="flex-row items-center gap-2">
        <View className="w-3 h-3 bg-orange-500 rounded-full" />
        <View>
          <Text className="text-gray-500 font-comfortaa text-xs">Home</Text>
          <Text className="font-comfortaa text-gray-900 text-sm">{home}</Text>
        </View>
      </View>
    </View>

    {/* Requester Info */}
    <View className="border-t border-gray-100 pt-4 mb-6">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {requesterAvatar ? (
            <Image
              source={{ uri: requesterAvatar }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <View className="w-12 h-12 bg-gray-300 rounded-full items-center justify-center">
              <Ionicons name="person" size={20} color="white" />
            </View>
          )}
          <View>
            <Text className="font-comfortaa-bold text-gray-900">
              {requesterName}
            </Text>
            <Text className="text-gray-500 font-comfortaa text-sm">
              {requesterEmail}
            </Text>
          </View>
        </View>
        <TouchableOpacity className="p-2">
          <Ionicons name="ellipsis-horizontal" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>

    {/* Action Buttons */}
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        className="bg-gray-100 py-3 px-6 rounded-2xl flex-row items-center gap-2"
        onPress={onViewDetails}
      >
        <Text className="text-gray-600 font-comfortaa-bold">View Details</Text>
        <Ionicons name="arrow-forward" size={16} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-primary py-3 px-8 rounded-2xl flex-row items-center gap-2"
        onPress={onAccept}
      >
        <Ionicons name="person-add" size={16} color="white" />
        <Text className="text-white font-comfortaa-bold">Accept</Text>
        <Ionicons name="git-network" size={16} color="white" />
      </TouchableOpacity>
    </View>
  </View>
);

export default CoverageRequestCard;
