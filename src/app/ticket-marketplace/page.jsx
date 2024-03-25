"use client";

import React, {useEffect} from "react";
import {Flex, Spinner, useToast, Text, Stack, SimpleGrid, Button} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { FaLocationDot, FaClock } from "react-icons/fa6";

export default function TicketMarketplacePage() {
    const [loading, setLoading] = React.useState(true);
    const [events, setEvents] = React.useState([]);
    const toast = useToast();
    const supabase = createClientComponentClient();
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getUser().then((response) => {
            if (!response.data.user) {
                toast({
                    title: "Please sign in to view this page",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                router.push("/sign-in");
                return;
            }

            supabase.from("events").select().then((response) => {
                const filteredEvents = response.data.filter((event) => {
                    return event.time > new Date().toISOString();
                }
                );
                setEvents(filteredEvents);
                setLoading(false);
            });
        });
    }, []);

    if(loading) {
        return (
            <Flex align="center" justify="center" h="100vh">
                <Spinner />
            </Flex>
        );
    }

    return (
        <Flex direction="column" align="center" h="100vh">
            <Flex>
                <Button onClick={() => {router.push("/main")}}>Home</Button>
            </Flex>
            <Stack spacing={4} w="100%">
            <Text fontSize="2rem" fontWeight="bold">Ticket Marketplace</Text>
            <SimpleGrid  w="100%" columns={3} spacing={8} p={8}>
            {events.map((event) => (
                <Stack bg="gray.100" borderRadius="10px" p="1rem" align="center">
                    <Text fontSize="1.7rem" fontWeight="semibold">{event.title}</Text>
                    <Text fontSize="1.3rem">{event.description}</Text>
                    <Flex align="center">
                        <FaLocationDot />
                        <Text ml={2}>{event.location}</Text>
                    </Flex>
                    <Flex align="center">
                        <FaClock />
                        <Text ml={2}>{new Date(event.time).toLocaleString()}</Text>
                    </Flex>
                    <Button onClick={() => {router.push(`/purchase/${event.id}`)}} colorScheme="primary">Buy Tickets</Button>
                </Stack>
            ))}
            </SimpleGrid>
            </Stack>
        </Flex>
    );
}