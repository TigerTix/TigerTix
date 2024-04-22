"use client";

import React, {useEffect} from "react";
import {Flex, Spinner, useToast, Text, Stack, SimpleGrid, Button, Input, Select} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { FaLocationDot, FaClock } from "react-icons/fa6";

export default function TicketMarketplacePage() {
    const [loading, setLoading] = React.useState(true);
    const [events, setEvents] = React.useState([]);
    const toast = useToast();
    const supabase = createClientComponentClient();
    const router = useRouter();


    const [inputFilterNum, setFilterNum] = React.useState('')
    const [inputFilterType, setFilterType] = React.useState('')
    const [filteredEvents, setFilteredEvents] = React.useState([]);


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
                const futureEvents = response.data.filter((event) => {
                    return event.time > new Date().toISOString();
                }
                );
                setEvents(futureEvents);
                setFilteredEvents(futureEvents);
                setLoading(false);
            });
        });
    }, []);

    useEffect(() => {
        if(inputFilterNum === '') {
            const filteredEvents = events.filter((event) => {
                return inputFilterType === '' || event.type === inputFilterType;
            }
            );
            setFilteredEvents(filteredEvents);
            return;
        }
        const filteredEvents = events.filter((event) => {
            return event.ticket_price <= inputFilterNum && (inputFilterType === '' || event.type === inputFilterType);
        })
        setFilteredEvents(filteredEvents);
    }, [inputFilterNum, inputFilterType]);

    if(loading) {
        return (
            <Flex align="center" justify="center" h="100vh">
                <Spinner />
            </Flex>
        );
    }

    return (
        <Flex direction="column" align="center" h="100vh" p="2rem">
            <Flex>
                <Button onClick={() => {router.push("/main")}}>Home</Button>
            </Flex>
            <Flex>
            </Flex>
            <Stack spacing={4} w="100%">
            <Text fontSize="2rem" fontWeight="bold">Ticket Marketplace</Text>
            <Stack>
                <Flex>
                    <Text  w="12rem" fontSize="1.5rem" fontWeight="bold">Filter by price:</Text>
                    <Input w="20rem" value={inputFilterNum} onChange={(e) => setFilterNum(e.target.value)}></Input>
                </Flex>
                <Flex>
                    <Text w="12rem" fontSize="1.5rem" fontWeight="bold">Filter by type:</Text>
                    <Select placeholder="All Events" w="20rem" value={inputFilterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="Concerts">Concerts</option>
                        <option value="Sports">Sports</option>
                        <option value="Theater">Theater</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Festivals">Festivals</option>
                        <option value="Exhibitions and Expos">Exhibitions and Expos</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                    </Select>
                </Flex>
            </Stack>
            <SimpleGrid  w="100%" columns={3} spacing={8}>
            {filteredEvents.map((event) => (
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