import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ONBOARDING_PAGES = [
  {
    title: "Pickup Buddi",
    subtitle: "Support Beyond Pickup",
    description:
      "From helping with homework to escorting to afterschool activities, Buddis are more than babysitters—they are buddies.",
    image: require("../../assets/images/onboarding/onboarding_1.png"),
  },
  {
    title: "Pickup Buddi",
    subtitle: "Safe pickups, happy journeys.",
    description:
      "Trusted student companions walking your child safely home—with heart and care.",
    image: require("../../assets/images/onboarding/onboarding_2.png"),
  },
  {
    title: "Pickup Buddi",
    subtitle: "We Put Safety First.",
    description:
      "Our Buddis go through background checks, interviews, school verification, and teacher recommendations—so you never have to worry.",
    image: require("../../assets/images/onboarding/onboarding_3.png"),
  },
  {
    title: "Pickup Buddi",
    subtitle: "",
    description: "",
    image: require("../../assets/images/onboarding/onboarding_4.png"),
    isFinal: true,
  },
];

const DOT_SIZE = 10;
const DOT_SPACING = 8;
const DOT_COLOR_ACTIVE = "#F6C663";
const DOT_COLOR_INACTIVE = "#E0E0E0";
const PRIMARY_COLOR = "#F6C663";
const BUTTON_TEXT_COLOR = "#fff";
const BUTTON_BG_COLOR = "#F6C663";
const BUTTON_BG_COLOR_SECONDARY = "#fff";
const BUTTON_TEXT_COLOR_SECONDARY = "#F6C663";

const Onboarding = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const router = useRouter();

  // Uncomment this logic to show onboarding only once, when you're new on the app
  // useEffect(() => {
  //   const seen = await AsyncStorage.getItem('onboarding_seen');
  //   if (seen) router.replace('/login');
  // }, []);
  // const markSeen = () => AsyncStorage.setItem('onboarding_seen', 'true');

  const handleNext = () => {
    if (page < ONBOARDING_PAGES.length - 1 && scrollRef.current) {
      scrollRef.current.scrollTo({ x: width * (page + 1), animated: true });
    }
  };

  const handleSkip = () => {
    // router.replace('/login');
  };

  const handleStartNow = () => {
    // markSeen();
    // router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Background SVGs */}
      <View className="absolute left-0 top-0">
        <Image
          source={require("../../assets/images/onboarding/left.png")}
          className="w-32 h-32"
          resizeMode="contain"
        />
      </View>
      <View className="absolute right-0 bottom-0">
        <Image
          source={require("../../assets/images/onboarding/bottom_right.png")}
          className="w-32 h-32"
          resizeMode="contain"
        />
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const newPage = Math.round(e.nativeEvent.contentOffset.x / width);
          setPage(newPage);
        }}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {ONBOARDING_PAGES.map((item, idx) => (
          <View
            key={idx}
            style={{ width }}
            className="items-center justify-center px-6 pt-12 pb-8"
          >
            <View className="rounded-full overflow-hidden w-56 h-56 mb-4">
              <Image
                source={item.image}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <Text
              className="text-3xl font-comfortaa-bold text-center"
              style={{
                color: PRIMARY_COLOR,
                textShadowColor: "#fff",
                textShadowRadius: 2,
              }}
            >
              {item.title}
            </Text>
            {item.subtitle ? (
              <Text className="text-lg font-comfortaa-medium text-center mt-2 text-gray-700">
                {item.subtitle}
              </Text>
            ) : null}
            {item.description ? (
              <Text className="text-center font-comfortaa text-gray-500 mt-2 mb-4">
                {item.description}
              </Text>
            ) : null}
            {item.isFinal && (
              <View className="w-full mt-6 flex-row justify-center space-x-4">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-full border border-[#F6C663] bg-white"
                  onPress={() => {
                    /* router.replace('/login') */
                  }}
                >
                  <Text
                    className="text-center font-comfortaa-medium"
                    style={{ color: BUTTON_TEXT_COLOR_SECONDARY }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-full bg-[#F6C663]"
                  onPress={handleStartNow}
                >
                  <Text
                    className="text-center font-comfortaa-medium"
                    style={{ color: BUTTON_TEXT_COLOR }}
                  >
                    Start Now
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      {/* Dots */}
      <View className="flex-row justify-center items-center mb-8">
        {ONBOARDING_PAGES.map((_, idx) => (
          <View
            key={idx}
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              marginHorizontal: DOT_SPACING / 2,
              backgroundColor:
                page === idx ? DOT_COLOR_ACTIVE : DOT_COLOR_INACTIVE,
            }}
          />
        ))}
      </View>
      {/* Navigation Buttons */}
      {!ONBOARDING_PAGES[page]?.isFinal && (
        <View className="flex-row justify-between items-center px-8 mb-8">
          <TouchableOpacity
            className="py-3 px-6 rounded-full border border-[#F6C663] bg-white"
            onPress={handleSkip}
          >
            <Text
              className="font-comfortaa-medium"
              style={{ color: BUTTON_TEXT_COLOR_SECONDARY }}
            >
              Skip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-8 rounded-full bg-[#F6C663]"
            onPress={handleNext}
          >
            <Text
              className="font-comfortaa-medium"
              style={{ color: BUTTON_TEXT_COLOR }}
            >
              Next →
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Onboarding;
