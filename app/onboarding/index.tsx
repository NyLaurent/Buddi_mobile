import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const ONBOARDING_PAGES = [
  {
    title: "Pickup Buddi",
    subtitle: "Safe pickups, happy journeys.",
    description:
      "Trusted student companions walking your child safely home—with heart and care.",
    image: require("../../assets/images/onboarding/onboarding_1.png"),
  },
  {
    title: "Pickup Buddi",
    subtitle: "We Put Safety First.",
    description:
      "Our Buddis go through background checks, interviews, school verification, and teacher recommendations—so you never have to worry.",
    image: require("../../assets/images/onboarding/onboarding_2.png"),
  },
  {
    title: "Pickup Buddi",
    subtitle: "Support Beyond Pickup",
    description:
      "From helping with homework to escorting to afterschool activities, Buddis are more than babysitters—they're buddies.",
    image: require("../../assets/images/onboarding/onboarding_3.png"),
  },
  {
    title: "Pickup Buddi",
    subtitle: "Get Started Now!",
    description:
      "More than just babysitting — it's student-to-student support.",
    image: require("../../assets/images/onboarding/onboarding_4.png"),
    isFinal: true,
  },
];

const DOT_SIZE = 8;
const DOT_SPACING = 12;
const DOT_COLOR_ACTIVE = "#FF932E";
const DOT_COLOR_INACTIVE = "#E0E0E0";
const DOT_SCALE_ACTIVE = 1.2;
const DOT_SCALE_INACTIVE = 1;
const PRIMARY_COLOR = "#FF932E";
const BUTTON_TEXT_COLOR = "#fff";
const BUTTON_BG_COLOR = "#FF932E";
const BUTTON_BG_COLOR_SECONDARY = "#fff";
const BUTTON_TEXT_COLOR_SECONDARY = "#FF932E";

const Onboarding = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const router = useRouter();
  const dotAnimations = useRef(
    ONBOARDING_PAGES.map(() => new Animated.Value(0))
  ).current;
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Uncomment this logic to show onboarding only once, when you're new on the app
  // useEffect(() => {
  //   const seen = await AsyncStorage.getItem('onboarding_seen');
  //   if (seen) router.replace('/login');
  // }, []);
  // const markSeen = () => AsyncStorage.setItem('onboarding_seen', 'true');

  const animateDot = (index: number, toValue: number) => {
    Animated.spring(dotAnimations[index], {
      toValue,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleScroll = (e: any) => {
    const newPage = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newPage !== page) {
      setPage(newPage);
      ONBOARDING_PAGES.forEach((_, idx) => {
        animateDot(idx, idx === newPage ? 1 : 0);
      });
    }
  };

  const handleNext = () => {
    if (page < ONBOARDING_PAGES.length - 1 && scrollRef.current) {
      setIsTransitioning(true);
      scrollRef.current.scrollTo({ x: width * (page + 1), animated: true });
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const handleSkip = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: width * (ONBOARDING_PAGES.length - 1),
        animated: true,
      });
      setPage(ONBOARDING_PAGES.length - 1);
    }
  };

  const handleStartNow = () => {
    // markSeen();
    // router.replace('/login');

    router.push("/role-select" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Background Images */}
      <View className="absolute left-[-30px] top-[300px] -translate-y-1/2">
        <Image
          source={require("../../assets/images/onboarding/left.png")}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </View>
      <View
        className="absolute right-0 bottom-0 opacity-50"
        style={{ zIndex: -1 }}
      >
        <Image
          source={require("../../assets/images/onboarding/bottom_right.png")}
          className="w-40 h-40"
          resizeMode="contain"
        />
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {ONBOARDING_PAGES.map((item, idx) => (
          <View
            key={idx}
            style={{ width }}
            className="items-center justify-center px-6 pt-8 pb-4"
          >
            <View className="rounded-full overflow-hidden w-72 h-72 mb-6">
              <Image
                source={item.image}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-52 h-16 mb-2"
              resizeMode="contain"
            />
            {item.subtitle ? (
              <Text className="text-lg font-comfortaa-bold text-center mt-2 text-gray-700">
                {item.subtitle}
              </Text>
            ) : null}
            {item.description ? (
              <Text className="text-center font-comfortaa text-gray-500 mt-2 mb-4">
                {item.description}
              </Text>
            ) : null}
            {item.isFinal && (
              <View className="w-full mt-4 px-4">
                <TouchableOpacity
                  className="w-full py-3 rounded-full bg-primary items-center justify-center"
                  onPress={handleStartNow}
                >
                  <Text
                    className="text-center font-comfortaa-bold"
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
      {!ONBOARDING_PAGES[page]?.isFinal && (
        <View
          style={{ position: "absolute", bottom: height * 0.16, width: "100%" }}
          className="flex-row justify-center items-center"
        >
          {ONBOARDING_PAGES.map((_, idx) => (
            <Animated.View
              key={idx}
              style={{
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: DOT_SIZE / 2,
                marginHorizontal: DOT_SPACING / 2,
                backgroundColor:
                  page === idx ? DOT_COLOR_ACTIVE : DOT_COLOR_INACTIVE,
                transform: [
                  {
                    scale: dotAnimations[idx].interpolate({
                      inputRange: [0, 1],
                      outputRange: [DOT_SCALE_INACTIVE, DOT_SCALE_ACTIVE],
                    }),
                  },
                ],
                opacity: dotAnimations[idx].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              }}
            />
          ))}
        </View>
      )}
      {/* Navigation Buttons */}
      {!ONBOARDING_PAGES[page]?.isFinal && (
        <View
          style={{ position: "absolute", bottom: height * 0.08, width: "100%" }}
          className="flex-row justify-between items-center px-8"
        >
          <TouchableOpacity
            className="py-3 px-6 rounded-full border border-gray bg-white flex-row items-center justify-center"
            onPress={handleSkip}
          >
            <Text className="font-comfortaa-medium mr-2 text-black">Skip</Text>
            <LogOut size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-8 rounded-full bg-primary flex-row items-center justify-center"
            onPress={handleNext}
          >
            <Text
              className="font-comfortaa-medium mr-2"
              style={{ color: BUTTON_TEXT_COLOR }}
            >
              Next
            </Text>
            <LogOut size={20} color={BUTTON_TEXT_COLOR} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Onboarding;
