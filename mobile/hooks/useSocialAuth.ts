import { useSSO } from '@clerk/clerk-expo'
import { useState } from 'react'
import { Alert } from 'react-native'

export default function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null)
  const {startSSOFlow} = useSSO()

  const handleSocialAuth = async(strategy: 'oauth_google'|'oauth_apple')=>{
    setLoadingStrategy(strategy)
    try {
     const {createdSessionId, setActive} = await startSSOFlow({strategy})
     if(createdSessionId && setActive){
      await setActive({session: createdSessionId})
     }
    } catch (error) {
      console.log("Social auth error: ", error)
      const provider = strategy === 'oauth_google' ? 'Google' : 'Apple'
      Alert.alert("Error", `There was an error during ${provider} authentication. Please try again.`)
    }finally{
      setLoadingStrategy(null)
    }
  }
  return {loadingStrategy, handleSocialAuth}
}
