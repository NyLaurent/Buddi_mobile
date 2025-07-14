import React from "react";
import { useLocalSearchParams } from "expo-router";
import ChatScreen from "../../../components/commons/ChatScreen";

export default function ParentChatScreen() {
  const { roomId, buddiName, buddiAvatar } = useLocalSearchParams<{
    roomId: string;
    buddiName: string;
    buddiAvatar?: string;
  }>();

  if (!roomId) {
    return null;
  }

  return (
    <ChatScreen
      chatRoomId={roomId}
      otherUserName={buddiName || "Buddi"}
      otherUserAvatar={buddiAvatar}
    />
  );
} 