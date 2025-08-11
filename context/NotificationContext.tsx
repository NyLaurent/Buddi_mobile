import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-notifications";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);

  useEffect(() => {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Configure notification channel for Android
    if (Platform.OS === "android") {
      // Default channel for general notifications
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
        // Enhanced visibility settings
        enableVibrate: true,
        enableLights: true,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true, // Bypass Do Not Disturb
        showBadge: true,
      });

      // High-priority channel for trip-related notifications
      Notifications.setNotificationChannelAsync("trips", {
        name: "Trip Updates",
        description:
          "Important updates about your child's pickup and trip status",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: "#FF6B35",
        sound: "default",
        enableVibrate: true,
        enableLights: true,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
        showBadge: true,
      });
    }
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response: ",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
        // Handle the notification response here
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
