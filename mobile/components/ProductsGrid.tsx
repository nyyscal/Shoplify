import { View, Text } from 'react-native'
import React from 'react'
import { Product } from '@/types'

interface ProductsGridProps{
  products: Product[]
  isLoading: boolean
  isError: boolean
}

const ProductsGrid = ({products, isLoading, isError}: ProductsGridProps) => {
  return (
    <View>
      <Text>ProductsGrid</Text>
    </View>
  )
}

export default ProductsGrid