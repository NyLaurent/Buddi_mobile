import { View, Text } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AvailableBuddie from '@/components/parent/AvailableBuddie'
import NoBuddi from '@/components/parent/NoBuddi'

const MyBuddyPage = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        <Text className="text-2xl font-bold">My Buddies</Text>

        {/* <AvailableBuddie /> */}
        <NoBuddi />


      </View>
    </SafeAreaView>
  )
}

export default MyBuddyPage;
