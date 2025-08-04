import { useLocalSearchParams } from "expo-router";
import ChatScreen from "../../../components/commons/ChatScreen";

export default function ParentChatScreen() {
  const { roomId, buddiName } = useLocalSearchParams<{
    roomId: string;
    buddiName: string;
  }>();

  if (!roomId) {
    return null;
  }

  return (
    <ChatScreen chatRoomId={roomId} otherUserName={buddiName || "Buddi"} />
  );
}
