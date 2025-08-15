module.exports = {
    expo: {
        name: "Pickup Buddi",
        slug: "pickup-buddi",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "pickupbuddi",
        userInterfaceStyle: "automatic",
        newArchEnabled: false,
        ios: {
            supportsTablet: true,
            bundleIdentifier: "pickup-buddi",
            icon: {
                light: "./assets/images/ios-light.png",
                dark: "./assets/images/ios-dark.png",
                tinted: "./assets/images/ios-tinted.png"
            },
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true,
            package: "com.lau_lanez.pickupbuddi",
            googleServicesFile: "./google-services.json",
            permissions: [
                "android.permission.INTERNET",
                "android.permission.ACCESS_NETWORK_STATE",
                "android.permission.VIBRATE",
                "android.permission.WAKE_LOCK",
                "android.permission.POST_NOTIFICATIONS"
            ],
            // Additional Android configuration
            allowBackup: true,
            fullBackupContent: false,
            // Build configuration
            buildToolsVersion: "35.0.0",
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            minSdkVersion: 24
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ],
            [
                "expo-video",
                {
                    supportsBackgroundPlayback: true,
                    supportsPictureInPicture: true
                }
            ]
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            router: {},
            eas: {
                projectId: "15adc2c2-b938-4207-899d-4eb68721b62f"
            }
        },
        owner: "pickup_buddi_llc"
    }
};
