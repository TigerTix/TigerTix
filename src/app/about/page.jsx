"use client"

import React, {useEffect} from "react";
import {Flex, Spinner, useToast, Text, Stack, SimpleGrid, Button, Input, Select, Link} from "@chakra-ui/react";
import NextLink from 'next/link'
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const router = useRouter();

    return (
        <Stack w="100vw" align="center">
            <Flex w="60vw" justify="space-between" align="center" py="1rem" mt="1rem">
            <Text fontSize="1.5rem" fontWeight="bolder">TigerTix</Text>
            <Flex align="center" gap="1rem">
                <Link as={NextLink} href="/">Home</Link>
                <Link as={NextLink} href="/about" fontWeight="bold">About</Link>
                <Link as={NextLink} href="/sign-in">Sign In</Link>
            </Flex>
            <Button colorScheme="primary" onClick={() => {router.push('/sign-up')}}>Sign Up</Button>
            </Flex>
            <Flex h="1px" w="60vw" bg="gray.400"></Flex>
            <Text color="" mt="3rem"  w="50rem" fontSize="5rem" fontWeight="regular">About Us</Text>
            <Text color="gray.600" w="50rem" fontSize="1.2rem" fontWeight="regular">
                TigerTix is <b>not</b> a real app or company, it is a project created for CPSC 3120 at Clemson University. <br></br>
                You can create accounts, and buy and sell tickets if there is any available, however there is no transaction of real money and no events on the website are real at all. <br></br>
            </Text>
            <Text color="" mt="3rem"  w="50rem" fontSize="5rem" fontWeight="regular">How We Built It</Text>
            <Text color="gray.600" w="50rem" fontSize="1.2rem" fontWeight="regular">
                TigerTix is built using Next.js with React, Chakra UI, and Supabase. It is deployed with Vercel <br></br>
                <li>Next.js is a React framework that allows for server-side rendering, static site generation, and more.</li>
                <li>Chakra UI is a component library that allows for easy styling and responsive design.</li>
                <li>Supabase is a backend as a service that allows for easy authentication and database management.</li>
                <li>Vercel is a cloud platform that allows for easy deployment of Next.js applications. It also allows for github PR's to be automatically deployed when merged, which is nice.</li>
            </Text>


            

        </Stack>
    )
}