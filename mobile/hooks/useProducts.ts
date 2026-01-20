
import { useApi } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@/types'

const useProducts = () => {
  const api = useApi()

  const res  = useQuery({
    queryKey:["products"],
    queryFn: async()=>{
      const {data} = await api.get<Product[]>("/products")
      return data 
    }
  })
  return res
}

export default useProducts