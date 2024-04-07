"use client";

import React, {useEffect, useState} from "react";
import {Flex, Spinner, useToast, Text, Stack, Button, Input, Box, Divider, AbsoluteCenter} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { FaLocationDot, FaClock } from "react-icons/fa6";

export default function PurchaseTicketPage({params}) {
    const [loading, setLoading] = React.useState(true);
    const [event, setEvent] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const [totalTickets, setTotalTickets] = React.useState([]);
    const toast = useToast();
    const supabase = createClientComponentClient();
    const router = useRouter();

    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [ticketsRemaining, setTicketsRemaining] = useState(0);

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
            setUser(response.data.user);

            supabase.from("events").select().eq("id", params.event_id).then((response) => {
                if(response.data.length === 0) {
                    toast({
                        title: "Event not found",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                    router.push("/ticket-marketplace");
                    return;
                }
                setEvent(response.data[0]);

                supabase.from("tickets").select().eq("event_id", params.event_id).then((response) => {
                    setTotalTickets(response.data);
                    setTicketsRemaining(response.data.filter((ticket) => ticket.owner_id === null).length);
                });

                setLoading(false);
            });
        });
    }, []);


    const handleTicketPurchase = () => {
        if(ticketQuantity < 1) {
            toast({
                title: "Please enter a valid quantity",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        // loop through the created tickets for the event, and find the tickets with no owner and assign them to the current user
        supabase.from("tickets").select().eq("event_id", event.id).is("owner_id", null).then((response) => {
            const tickets = response.data.slice(0, ticketQuantity);
            tickets.forEach((ticket) => {
                supabase.from("tickets").update({owner_id: user.id}).eq("id", ticket.id).then((response) => {
                    console.log(response);
                });
            });
            toast({
                title: "Tickets purchased successfully",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            setTicketsRemaining(ticketsRemaining - ticketQuantity);

            
        });

    }

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
            <Stack spacing={4} w="100%" align="center">
            <Text fontSize="2rem" fontWeight="bold">Buy Tickets</Text>
            <Text mt="0.5rem" fontSize="2rem" fontWeight="semibold">Event info</Text>
            <Stack borderRadius="10px" p="1rem">
                <Text fontSize="1.7rem" fontWeight="semibold">Title: {event.title}</Text>
                <Text fontSize="1.3rem">Description: {event.description}</Text>
                <Flex align="center">
                    <FaLocationDot />
                    <Text ml={2}>{event.location}</Text>
                </Flex>
                <Flex align="center">
                    <FaClock />
                    <Text ml={2}>{new Date(event.time).toLocaleString()}</Text>
                </Flex>
                <Flex>
                    <Text fontSize="1.3rem">Price: ${event.ticket_price}</Text>
                </Flex>
                <Flex>
                    <Text fontSize="1.3rem">Tickets remaining: {ticketsRemaining} / {totalTickets.length}</Text>
                </Flex>
            </Stack>

            <Stack >
                <Text fontSize="2rem" fontWeight="semibold">Purchase tickets</Text>
                <Input type="number" value={ticketQuantity} onChange={(e) => setTicketQuantity(Number(e.target.value))} />
                <Button onClick={handleTicketPurchase} colorScheme="primary">Buy Tickets</Button>
                <Box position='relative' padding='10'>
                    <Divider />
                    <AbsoluteCenter bg='white' px='2'>
                        or
                    </AbsoluteCenter>
                </Box>
                {/* view secondhand tickets for sale */}
                <Button onClick={() => {router.push(`/resale/${event.id}`)}} colorScheme="primary">View Secondhand Tickets</Button>
            </Stack>
            </Stack>
        </Flex>
    );
}