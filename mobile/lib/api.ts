import axios from "axios"
import { useAuth } from "@clerk/clerk-expo"
import { useEffect } from "react"
//send auth token

const API_URL = "http://localhost:300/api"

const api = axios.create({
  baseURL: API_URL,
  headers:{
    "Content-Type":"application/json"
  }
})

export const useApi = () => {
  const {getToken} = useAuth()

  //on every requestm add token so that backend knows we are authenticated using interceptors
  useEffect(()=>{
    const interceptor = api.interceptors.request.use(async(config)=>{
      const token = await getToken()

      if(token){
        config.headers.Authorization =`Bearer ${token}`
      }
      return config
    })

    //clean up method: remove interceptors when component unmounts
    return ()=>{
      api.interceptors.request.eject(interceptor)
    }
  },[getToken])
  return api
}
