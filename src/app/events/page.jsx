"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Text, Box, Button, Spinner, Flex, Stack, SimpleGrid, Input, ButtonGroup, IconButton, EditableInput, useToast } from '@chakra-ui/react';
import { FaLocationDot, FaClock } from "react-icons/fa6";

export default function EventsPage() {
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();

    const [user, setUser] = useState(null);

    const [events, setEvents] = useState([]);

    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        supabase.auth.getUser().then((response) => {
            if (!response.data.user) {
                router.push('/sign-in');
                return;
            }
            setUser(response.data.user);

            supabase.from('events').select().then((eventResponse) => {
                console.log("total events", eventResponse.data)
                // filter out events that have already happened or have a time of null
                const filteredEvents = eventResponse.data.filter(event => {
                    return event.time > new Date().toISOString();
                });
                setEvents(filteredEvents);
                console.log("filtered events", filteredEvents);
                setLoading(false);
            });

        });
    }, []);

    if (loading) {
        return (
            <Flex align="center" justify="center" h="100vh">
                <Spinner size="xl" thickness='4px' color='primary.500' />
            </Flex>
        );
    }

    // This will be a grid view of all events, and can be searched by name,
    // only using chakra components
    return (
        <Stack p={8} spacing={8}>
            <Text fontSize="2rem" fontWeight="bold">Events</Text>
            <SimpleGrid columns={3} spacing={8} p={8}>
                {events.map((event, index) => {
                    return (
                        <Stack bg="gray.100" borderRadius="10px" p="1rem" align="center" key={index}>
                            <Text fontSize="1.7rem" fontWeight="semibold">{event.title}</Text>
                            <Text fontSize="1.3rem">{event.description}</Text>
                            {/* Flexbox as a little divider line */}
                            <Flex width="100%" height="1px" bgColor="gray.400" my="0.75rem" borderRadius="10px" />
                            <Flex gap="0.5rem" align="center" color="gray.700">
                                <FaLocationDot size="1rem" />
                                <Text fontSize="1rem">{event.location}</Text>
                            </Flex>
                            <Flex gap="0.5rem" align="center" color="gray.700">
                                <FaClock size="1rem" />
                                <Text fontSize="1rem">{new Date(event.time).toLocaleString()}</Text>
                            </Flex>
                            <Button color={"white"} width={"100%"} bgColor={"primary.400"} _hover={{ bgColor: "primary.500" }} borderRadius={"25px"} onClick={() => { router.push(`/events/${event.id}`) }}>
                                View Event
                            </Button>
                        </Stack>
                    )
                }
                )}
                
            </SimpleGrid>
        </Stack>
    )

}