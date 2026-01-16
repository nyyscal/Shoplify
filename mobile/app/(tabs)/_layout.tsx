import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import {Ionicons} from "@expo/vector-icons"
import { useAuth } from '@clerk/clerk-expo'
const TabsLayout = () => {
  const {isSignedIn, isLoaded} = useAuth()

  if(!isLoaded) return null

  if(!isSignedIn) return <Redirect href={"/(auth)"}/>

  return (
    <Tabs>
      <Tabs.Screen
      name="index"
      options={{
        title:"Home",
        tabBarIcon:({color,size})=> <Ionicons name='grid' />
      }}
      />
      <Tabs.Screen
      name="cart"
      options={{
        title:"Cart",
        tabBarIcon:({color,size})=> <Ionicons name='cart' />
      }}
      />
      <Tabs.Screen
      name="profile"
      options={{
        title:"Profile",
        tabBarIcon:({color,size})=> <Ionicons name='person' />
      }}
      />
    </Tabs>
  )
}

export default TabsLayout