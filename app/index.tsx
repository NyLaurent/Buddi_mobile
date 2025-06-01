import { Redirect } from "expo-router";

const Index = () => {
  // Uncomment for conditional onboarding logic:
  // const seen = await AsyncStorage.getItem('onboarding_seen');
  // if (!seen) return <Redirect href="/onboarding" />;
  // return <Redirect href="/login" />;

  return <Redirect href="/parent" />;
};

export default Index;
