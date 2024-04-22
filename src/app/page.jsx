"use client"
import { Flex, Stack, Text, Button, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link'
import { MdAttachMoney } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaSearchLocation } from "react-icons/fa";
// router
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <>
    {/* create 2 triangels on the sides of screen */}
     <Flex position="absolute" w="100rem" bg="purple.300" h="50rem" top="20rem" left="-56.5rem" transform="rotate(65deg)" zIndex="-1"/>
     <Flex position="absolute" w="100rem" bg="purple.300" h="50rem" top="2rem" right="-63rem" transform="rotate(65deg)" zIndex="-1"/>


      <Stack align="center">
        <Flex w="60vw" justify="space-between" align="center" py="1rem" mt="1rem">
          <Text fontSize="1.5rem" fontWeight="bolder">TigerTix</Text>
          <Flex align="center" gap="1rem">
            <Link as={NextLink} href="/main">Home</Link>
            <Link as={NextLink} href="/about">About</Link>
            <Link as={NextLink} href="/sign-in">Sign In</Link>
          </Flex>
          <Button colorScheme="primary" onClick={() => {router.push('/sign-up')}}>Sign Up</Button>
        </Flex>
        <Flex h="1px" w="60vw" bg="gray.400"></Flex>
        <Text color="" mt="3rem" fontSize="5rem" fontWeight="regular">Discover. Select. Enjoy.</Text>
        <Text color="gray.600" w="40rem" fontSize="1.2rem" fontWeight="regular" align="center">Discover your favorite artists and events. Select the best seats and enjoy a seamless ticket buying process.</Text>
        <Flex w="70vw" justify="space-between" align="center" py="1rem" mt="4rem" h="20rem">
          <Stack w="18rem" h="18rem" bg="primary.300" justify="center" align="center" borderRadius="10px" shadow="lg" p="1rem">
            <MdAttachMoney size="4rem"/>
            <Text fontSize="2rem" fontWeight="bold">Sell</Text>
            <Text fontSize="1rem" fontWeight="regular" align="center">Sell tickets secondhand on TigerTix!</Text>
          </Stack>
          <Stack w="20rem" h="20rem" bg="primary.300" justify="center" align="center" borderRadius="10px" shadow="lg" p="1rem">
            <FaMoneyBillTransfer size="4rem"/>
            <Text fontSize="2rem" fontWeight="bold">Transfer</Text>
            <Text fontSize="1rem" fontWeight="regular" align="center">Transfer tickets to friends and family!</Text>

          </Stack>
          <Stack w="18rem" h="18rem" bg="primary.300" justify="center" align="center" borderRadius="10px" shadow="lg" p="1rem">
            <FaSearchLocation size="4rem"/>
            <Text fontSize="2rem" fontWeight="bold">Explore</Text>
            <Text fontSize="1rem" fontWeight="regular" align="center">Explore events near you!</Text>

          </Stack>
          
        </Flex>

      </Stack>
    </>
  );
}
