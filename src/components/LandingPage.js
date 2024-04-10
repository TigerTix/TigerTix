'use client';

import React, { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import { Link, HStack, Box, Flex, Image, Hide, Show, Button, VisuallyHidden } from '@chakra-ui/react';
import * as Yup from 'yup';

const LandingPage = () => {
    return (
        <Box
    bgImage="url(background.jpg)"
    bgSize="cover"
    bgPosition="center"
    w="100vw"
    h="100vh"
    overflow="hidden"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Box
      bg="rgba(190, 180, 210, 0.95)" // Adjust opacity and color as needed
      p="4"
      borderRadius="md"
      textAlign="center"
      mt="-45vh" // Move up by 20% of viewport height
      ml="-40vw" // Move left by 20% of viewport width
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0.5rem 0", color: "white"}}>
        Welcome to Tiger Tix
      </h1>
      <p style={{ fontSize: "1.2rem", fontWeight:"bold", margin: "0.5rem 0 1.5rem 0", color: "white" }}>
        Go Get 'Em, Tigers
      </p>
      <Box display="flex" justifyContent="center">
        <Link href="/sign-up" marginX={"5px"}>
          <Button bgColor={"primary.400"} mr="3" color={"white"}>
            Get Started
          </Button>
        </Link>
        <Link href="/sign-in" marginX={"5px"}>
          <Button colorScheme="purple">Login</Button>
        </Link>
      </Box>
    </Box>
  </Box>
    );
};
export default LandingPage;