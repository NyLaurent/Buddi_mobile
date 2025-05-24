import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CalendarProps {
  onDaySelect?: (date: Date) => void;
  selectedDate?: Date;
  primaryColor?: string;
}

const Calendar = ({
  onDaySelect,
  selectedDate = new Date(),
  primaryColor = "#FF932E",
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday)
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty spaces for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Format month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString("default", { month: "long" });
  };

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Check if a day is selected
  const isDaySelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = generateCalendarDays();

  return (
    <View className="bg-white rounded-2xl p-4 mx-4 border border-[#E8E8E8]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={() => navigateMonth("prev")} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="font-comfortaa-bold text-lg">
          {getMonthName(currentMonth)} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => navigateMonth("next")} className="p-2">
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Week days */}
      <View className="flex-row justify-between mb-2">
        {weekDays.map((day) => (
          <View key={day} style={{ width: 40 }} className="items-center">
            <Text className="font-comfortaa text-gray-500 text-sm">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View className="flex-row flex-wrap">
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={{ width: "14.28%" }}
            className="items-center py-2"
            onPress={() => {
              if (day && onDaySelect) {
                const selectedDate = new Date(currentMonth);
                selectedDate.setDate(day);
                onDaySelect(selectedDate);
              }
            }}
            disabled={!day}
          >
            {day ? (
              <View
                className={`w-8 h-8 rounded-full items-center justify-center
                  ${isDaySelected(day) ? "bg-primary" : ""}
                  ${
                    isToday(day) && !isDaySelected(day)
                      ? "border-2 border-primary"
                      : ""
                  }`}
                style={{
                  backgroundColor: isDaySelected(day)
                    ? primaryColor
                    : undefined,
                }}
              >
                <Text
                  className={`font-comfortaa ${
                    isDaySelected(day)
                      ? "text-white"
                      : isToday(day)
                      ? "text-primary"
                      : "text-gray-700"
                  }`}
                  style={{
                    color: isDaySelected(day)
                      ? "white"
                      : isToday(day)
                      ? primaryColor
                      : undefined,
                  }}
                >
                  {day}
                </Text>
              </View>
            ) : (
              <View className="w-8 h-8" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Calendar;
