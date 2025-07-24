import { useRouter } from "expo-router";
import SuccessScreen from "../../../components/commons/SuccessScreen";

export default function RecordingSuccess() {
  const router = useRouter();

  return (
    <SuccessScreen
      title="Recording Submitted"
      description="Your recording has been submitted successfully! We are now processing your submission. You will receive an email notification once your interview has been processed and approved."
      buttonText="Back to Login"
      onContinue={() => router.replace("/auth/login")}
      imagePath={require("../../../assets/images/onboarding/success.png")}
      primaryColor="#FF932E"
    />
  );
}
