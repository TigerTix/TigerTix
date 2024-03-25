"use client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import SignOut from 'src/components/SignOut';
import { Spinner, Flex, Button, Text, Box, SimpleGrid } from '@chakra-ui/react';
import moment from 'moment';

export default async function TicketView() {
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [events, setEvents] = useState(null);
  const router = useRouter();
  



  useEffect(() => {
    // ensure this is only run when the component mounts
    router.refresh();
    supabase.auth.getUser().then((response) => {
      if (!response.data.user) {
        router.push('/sign-in');
        return;
      }
      setUser(response.data.user);

      supabase.from('tickets').select().eq('owner_id', response.data.user.id).then((ticketsResponse) => {
        setTickets(ticketsResponse.data);
      });
      

      supabase.from('events').select().then((eventsResponse) => {
        setEvents(eventsResponse.data);
      });

      setLoading(false);
    }
    );
  }
    , []);


  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xl" thickness='4px' color='primary.500' />
      </Flex>
    );
  }

  return (
    <Flex flexDir={"column"} align={"center"}>
      <Flex flexDir={"row"} width={"100%"} justifyContent={"space-between"} paddingX={"10px"} paddingY={"5px"}>
        <Box width="150px">
          <Button color={"white"} width={"100%"} bgColor={"primary.400"} _hover={{ bgColor: "primary.500" }} borderRadius={"25px"} onClick={() => { router.push("/main") }}>
            Go back Home
          </Button>
        </Box>

        <Text fontSize="3xl" fontWeight="bold" textAlign="center">Ticket Veiw</Text>

        <Box width="150px">
          <SignOut />
        </Box>
      </Flex>
      <SimpleGrid columns={2} spacing="1.5rem" w="85%">
        {tickets && tickets.map((ticket) => {
          if(!events) return null;

          const event = events.find(e => e.id === ticket.event_id);

          const currentDate = moment();
          const eventDate = moment(event ? event.time : null);

          const status = currentDate.isBefore(eventDate) ? 'Upcoming' : 'Passed';

          return (
            <Box key={ticket.id} p={5} shadow="md" borderWidth="1px" borderRadius="10px" bgColor={"gray.100"}>
              <Text fontSize="2xl" fontWeight="bold">Ticket Number: {ticket.id}</Text>
              <Text fontSize="xl">Event Name: {event ? event.title : 'N/A'}</Text> 
              <Text fontSize="xl">Event Date: {event ? event.time : 'N/A'}</Text>
              <Text fontSize="xl">Event Location: {event ? event.location : 'N/A'}</Text>
              <Text fontSize="xl">Event Description: {event ? event.description : 'N/A'}</Text>
              <Text fontSize="xl">Ticket Price: {ticket.price}</Text>
              <Text fontSize="2xl" fontWeight="bold" color={status === "Passed" ? "red.500" : "green.500"}>{status}</Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </Flex>
  );

}