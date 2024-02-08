"use client"

import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme/theme'


function CustomChakraProvider({ children }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}

export default CustomChakraProvider; 