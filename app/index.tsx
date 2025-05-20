import { useRouter } from "expo-router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding");
    // Uncomment for conditional onboarding logic:
    // const seen = await AsyncStorage.getItem('onboarding_seen');
    // if (!seen) router.replace('/onboarding');
    // else router.replace('/login');
  }, []);
  return null;
};

export default Index;
