import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AdminVideoReviewCardProps {
  name: string;
  date: string;
  time: string;
  duration: string;
  onViewVideo: () => void;
  onPlayVideo?: () => void;
}

const AdminVideoReviewCard: React.FC<AdminVideoReviewCardProps> = ({
  name,
  date,
  time,
  duration,
  onViewVideo,
  onPlayVideo,
}) => {
  const videoSource = require("../../assets/videos/intro.mp4");
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const handlePlayVideo = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    onPlayVideo?.();
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.videoContainer} onPress={handlePlayVideo}>
        <VideoView
          style={styles.videoPlayer}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
        {!isPlaying && (
          <View style={styles.playButton}>
            <Ionicons name="play" size={24} color="#fff" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.dateTimeRow}>
            <Text style={styles.dateTime}>{date}</Text>
            <Text style={styles.dateTime}>{time}</Text>
          </View>
          <Text style={styles.duration}>{duration}</Text>
        </View>

        <TouchableOpacity style={styles.viewVideoButton} onPress={onViewVideo}>
          <Text style={styles.viewVideoText}>View Video</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color="#FF932E"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    flexDirection: "row",
    alignItems: "center",
  },
  videoContainer: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#23272F",
    marginBottom: 4,
    fontFamily: "Comfortaa-Regular",
  },
  dateTimeRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: "#8A8A8A",
    marginRight: 16,
    fontFamily: "Comfortaa-Regular",
  },
  duration: {
    fontSize: 14,
    color: "#23272F",
    fontFamily: "Comfortaa-Regular",
  },
  viewVideoButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 8,
  },
  viewVideoText: {
    fontSize: 16,
    color: "#FF932E",
    fontFamily: "Comfortaa-Regular",
  },
});

export default AdminVideoReviewCard;
