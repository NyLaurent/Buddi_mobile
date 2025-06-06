import { View, Text } from 'react-native'
import React from 'react'
import CallUpReviewCard from '@/components/parent/CallUpReviewCard'
import { SafeAreaView } from 'react-native-safe-area-context'

const payments = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
          <Text>payments</Text>
    

<CallUpReviewCard
  name="Brian Ford"
  email="brianford@lok.com"
  school="School, Name"
  requestedAgo="2 Days ago"
  description="Fill in the details below to invite Buddis to apply."
  schoolName="School Name"
  home="Senen"
  assignedKids={[
    { name: "Bryan Smith" },
    { name: "Bryan Smith" }
  ]}
  onRemove={() => { /* handle remove */ }}
  onApplicants={() => { /* handle applicants */ }}
/>
    </SafeAreaView>
  )
}

export default payments