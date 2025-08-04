import { useLocalSearchParams } from "expo-router";
import ChatScreen from "../../../components/commons/ChatScreen";

export default function BuddiChatScreen() {
  const { roomId, parentName } = useLocalSearchParams<{
    roomId: string;
    parentName: string;
  }>();

  if (!roomId) {
    return null;
  }

  return (
    <ChatScreen chatRoomId={roomId} otherUserName={parentName || "Parent"} />
  );
}
