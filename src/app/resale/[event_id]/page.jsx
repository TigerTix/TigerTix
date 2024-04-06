"use client";

import React, { useEffect, useState } from "react";
import { Flex, Spinner, useToast, Text, Stack, Button, Input, Box, Divider, AbsoluteCenter, SimpleGrid } from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { FaLocationDot, FaClock } from "react-icons/fa6";
import moment from "moment";

export default function PurchaseResaleTicketPage({ params }) {
    const [loading, setLoading] = React.useState(true);
    const [tickets, setTickets] = React.useState([]);
    const [event, setEvent] = React.useState([]);
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

            supabase.from("events").select().eq("id", params.event_id).then((response) => {
                if (response.data.length === 0) {
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
            });

            supabase.from("tickets").select().eq("event_id", params.event_id).eq("resale", true).then((response) => {
                setTickets(response.data);
                setLoading(false);
            });



        });
    }, []);


    let fixedDate = moment(event ? event.time : null).format("MMMM Do YYYY, h:mm a");
    if (loading) {
        return (
            <Flex align="center" justify="center" h="100vh">
                <Spinner />
            </Flex>
        );
    }

    return (
        <Flex direction="column" align="center" h="100vh">
            <Flex>
                <Button onClick={() => { router.push("/main") }}>Home</Button>
            </Flex>
            <Text fontSize="2xl" fontWeight="bold">Resale Tickets</Text>
            <Text fontSize="xl" fontWeight="bold">{event.title}</Text>

            <SimpleGrid columns={3} spacing="3%" width={"94%"} marginX={"3%"}>
                {tickets.map((ticket) => (

                    <Box key={ticket.id} p={5} shadow="md" borderWidth="1px" borderRadius="10px" bgColor={"gray.100"}>
                        <Text fontSize="xl" fontWeight={"bold"}>{event.title}</Text>
                        <Text fontSize="md">Date: {fixedDate}</Text>
                        <Text fontSize="md">{event.description}</Text>
                        <Text fontSize="md">Price: ${ticket.price}</Text>
                        <Text fontSize="md">Location: {event.location}</Text>



                        <Flex justifyContent="flex-end">
                            <Button color={"white"} width={"30%"} bgColor={"primary.400"} _hover={{ bgColor: "primary.500" }} borderRadius={"10px"} marginY={"10px"}>Buy Ticket</Button>
                        </Flex>
                    </Box>
                ))}
            </SimpleGrid>
        </Flex>
    );
}