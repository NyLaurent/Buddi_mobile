import { useLocalSearchParams } from "expo-router";
import ChatScreen from "../../../components/commons/ChatScreen";

export default function BuddiChatScreen() {
  const { roomId, parentName, parentAvatar } = useLocalSearchParams<{
    roomId: string;
    parentName: string;
    parentAvatar?: string;
  }>();

  if (!roomId) {
    return null;
  }

  return (
    <ChatScreen
      chatRoomId={roomId}
      otherUserName={parentName || "Parent"}
      otherUserAvatar={parentAvatar}
    />
  );
}
