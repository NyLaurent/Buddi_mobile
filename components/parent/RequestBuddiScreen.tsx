import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

import { router } from "expo-router";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RequestBuddiSuccessModal from "../modals/RequestBuddiSuccessModal";

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const RequestBuddiScreen = () => {
  const [successVisible, setSuccessVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [pickupHour, setPickupHour] = useState("");
  const [pickupMinute, setPickupMinute] = useState("");
  const [amPm, setAmPm] = useState("AM");
  const [numKids, setNumKids] = useState("");
  const [fromZone, setFromZone] = useState("");
  const [toZone, setToZone] = useState("");
  const [showAllDays, setShowAllDays] = useState(false);

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    // Prepare the data for submission
    const data = {
      description,
      days: selectedDays,
      pickupTime: `${pickupHour}:${pickupMinute} ${amPm}`,
      numKids,
      fromZone,
      toZone,
    };
    // TODO: send data to API
    setSuccessVisible(true);
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-white px-4 py-7"
        contentContainerStyle={{ minHeight: "100%" }}
      >
        <View className="flex-row items-center justify-between  mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-primary rounded-xl items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-comfortaa-bold">Buddi Request</Text>
          <TouchableOpacity className="w-10 h-10 bg-primary rounded-xl items-center justify-center">
            <Ionicons name="ellipsis-horizontal" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-3xl px-2 py-2 w-full max-w-2xl self-center">
          <Text className="text-2xl font-comfortaa-bold text-center mb-1">
            Request a Buddi
          </Text>
          <Text className="text-grayText font-comfortaa text-center mb-5 text-base">
            Fill in the details below to invite Buddis to apply.
          </Text>
          {/* Description */}
          <Text className="text-sm text-gray-500 font-comfortaa mb-1">
            Description
          </Text>
          <TextInput
            className="border border-gray rounded-xl px-4 py-3 font-comfortaa mb-1 text-base min-h-[80px]"
            placeholder="Ex: After-school pickup for Alex"
            placeholderTextColor="#B0B0B0"
            maxLength={100}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Available Time Slots */}
          <Text className="text-sm text-grayText font-comfortaa mb-1">
            Available Time Slots
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-3 border border-gray rounded-xl px-2 py-2">
            {(showAllDays ? allDays : allDays.slice(0, 3)).map((d) => (
              <TouchableOpacity
                key={d}
                className={`rounded-full px-3 py-1 flex-row items-center border ${
                  selectedDays.includes(d)
                    ? "bg-primary border-primary"
                    : "bg-gray border-gray"
                }`}
                onPress={() => handleDayToggle(d)}
              >
                <Text
                  className={`font-comfortaa text-xs ${
                    selectedDays.includes(d) ? "text-white" : "text-grayText"
                  }`}
                >
                  {d}
                </Text>
                {selectedDays.includes(d) && (
                  <Feather name="x" size={14} color="#fff" className="ml-1" />
                )}
              </TouchableOpacity>
            ))}
            {!showAllDays && (
              <TouchableOpacity
                className="bg-gray-100 rounded-full px-3 py-1 flex-row items-center"
                onPress={() => setShowAllDays(true)}
              >
                <Text className="font-comfortaa text-gray-400 text-xs">
                  Add more
                </Text>
                <Feather
                  name="plus"
                  size={14}
                  color="#B0B0B0"
                  className="ml-1"
                />
              </TouchableOpacity>
            )}
          </View>
          {/* Pickup Time */}
          <Text className="text-sm text-grayText font-comfortaa mb-1">
            Pickup Time
          </Text>
          <View className="flex-row items-center h-16 rounded-2xl border border-gray overflow-hidden mb-3">
            {/* Time Inputs */}
            <View className="flex-1 flex-row items-center justify-center">
              <TextInput
                className="text-3xl font-comfortaa-bold text-grayText text-center w-16 bg-transparent"
                placeholder="07"
                keyboardType="number-pad"
                maxLength={2}
                value={pickupHour}
                onChangeText={setPickupHour}
                underlineColorAndroid="transparent"
                selectionColor="#FF9100"
              />
              <Text className="text-3xl font-comfortaa-bold text-grayText mx-2">
                :
              </Text>
              <TextInput
                className="text-3xl font-comfortaa-bold text-grayText text-center w-16 bg-transparent"
                placeholder="00"
                keyboardType="number-pad"
                maxLength={2}
                value={pickupMinute}
                onChangeText={setPickupMinute}
                underlineColorAndroid="transparent"
                selectionColor="#FF9100"
              />
            </View>
            {/* AM/PM Selector */}
            <View className="flex-col w-20 border-l border-gray h-full">
              <TouchableOpacity
                className={`flex-1 items-center justify-center rounded-tr-2xl ${
                  amPm === "AM" ? "bg-primary" : "bg-white"
                }`}
                onPress={() => setAmPm("AM")}
              >
                <Text
                  className={`font-comfortaa-bold text-lg ${
                    amPm === "AM" ? "text-white" : "text-gray-500"
                  }`}
                >
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center justify-center rounded-br-2xl ${
                  amPm === "PM" ? "bg-primary" : "bg-white"
                }`}
                onPress={() => setAmPm("PM")}
              >
                <Text
                  className={`font-comfortaa-bold text-lg ${
                    amPm === "PM" ? "text-white" : "text-gray-500"
                  }`}
                >
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* How many kids */}
          <Text className="text-sm text-grayText font-comfortaa mb-1">
            How many of your kids need the service?
          </Text>
          <TextInput
            className="border border-gray rounded-xl px-4 py-3 font-comfortaa mb-3 text-base"
            placeholder="Enter number"
            placeholderTextColor="#B0B0B0"
            keyboardType="number-pad"
            value={numKids}
            onChangeText={setNumKids}
          />
          {/* From/To Zones */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1 mr-2">
              <Text className="text-sm text-grayText font-comfortaa mb-1">
                From
              </Text>
              <TextInput
                className="border border-gray rounded-xl px-4 py-3 font-comfortaa text-base"
                placeholder="Select zone(s)"
                placeholderTextColor="#B0B0B0"
                value={fromZone}
                onChangeText={setFromZone}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-sm text-grayText font-comfortaa mb-1">
                To
              </Text>
              <TextInput
                className="border border-gray rounded-xl px-4 py-3 font-comfortaa text-base"
                placeholder="Select zone(s)"
                placeholderTextColor="#B0B0B0"
                value={toZone}
                onChangeText={setToZone}
              />
            </View>
          </View>
          {/* Buttons */}
          <View className="flex-row items-center justify-between mt-2">
            <TouchableOpacity
              className="flex-1 bg-primary py-4 rounded-full items-center ml-2"
              onPress={handleSubmit}
            >
              <View className="flex-row items-center justify-center">
                <Feather name="check-square" size={20} color="white" />
                <Text className="text-white font-comfortaa-bold text-lg ml-2">
                  Confirm
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <RequestBuddiSuccessModal
  visible={successVisible}
  onClose={() => setSuccessVisible(false)}
/>
    </>
  );
};

export default RequestBuddiScreen;
