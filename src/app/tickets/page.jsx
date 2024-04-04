"use client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import SignOut from 'src/components/SignOut';
import { Spinner, Flex, Button, Text, Box, SimpleGrid, useToast, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalCloseButton, ModalFooter, Stack, Input } from '@chakra-ui/react';
import moment from 'moment';

export default function TicketView() {
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [events, setEvents] = useState(null);
  const [otherEmail, setOtherEmail] = useState('');


  const router = useRouter();
  const toast = useToast();


  const { isOpen: isTransferModalOpen, onOpen: onTransferModalOpen, onClose: onTransferModalClose } = useDisclosure()
  const { isOpen: isSellModalOpen, onOpen: onSellModalOpen, onClose: onSellModalClose } = useDisclosure()


  useEffect(() => {
    // ensure this is only run when the component mounts
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
    });
  }, []);


  const refreshTickets = () => {
    if (!user) return;
    supabase.from('tickets').select().eq('owner_id', user.id).then((ticketsResponse) => {
      setTickets(ticketsResponse.data);
      console.log(ticketsResponse.data);
    });


    supabase.from('events').select().then((eventsResponse) => {
      setEvents(eventsResponse.data);
    });
  }


  const validEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleTransfer = async () => {

    // checks to see if the ticket date is in the future




    if (!otherEmail || !validEmail(otherEmail)) {
      toast({
        title: "Error",
        description: "Please enter an email",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (otherEmail === user.email) {
      toast({
        title: "Error",
        description: "You cannot transfer a ticket to yourself",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { data, error } = await supabase.from('profiles').select('id').eq('email', otherEmail).limit(1);
    if (error) {
      console.error('Error checking email:', error);
      // Handle error appropriately in your app
      return false;
    }
    if (data.length === 0) {
      toast({
        title: "Error",
        description: "User with that email does not exist",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { data: ticketData, error: ticketError } = await supabase.from('tickets').select().eq('owner_id', user.id).limit(1);
    if (ticketError) {
      console.error('Error checking ticket:', ticketError);
      // Handle error appropriately in your app
      return false;
    }
    if (ticketData.length === 0) {
      toast({
        title: "Error",
        description: "No tickets to transfer",
        status: "error",
        duration: 3000,
        isClosable: true,

      });
      return;
    }

    const ticket = ticketData[0];
    const { error: transferError } = await supabase.from('tickets').update({ owner_id: data[0].id }).eq('id', ticket.id);
    if (transferError) {
      console.error('Error transferring ticket:', transferError);
      // Handle error appropriately in your app
      return false;
    }

    toast({
      title: "Success",
      description: "Ticket transferred",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // refresh the page



    onTransferModalClose();

    refreshTickets();



  }

  if (loading) {
    const intervalId = setInterval(() => {
      refreshTickets();
    }, 5000); // 5000 ms = 5 s
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
      <SimpleGrid columns={2} spacing="1.5rem" w="85%" >
        {tickets && tickets.map((ticket) => {
          if (!events) return null;

          const event = events.find(e => e.id === ticket.event_id);

          const currentDate = moment();
          const eventDate = moment(event ? event.time : null);

          const status = currentDate.isBefore(eventDate) ? 'Upcoming' : 'Passed';

          const fixedDate = eventDate.format('MMMM Do YYYY, h:mm:ss a');


          return (
            <>
              <Box key={ticket.id} p={5} shadow="md" borderWidth="1px" borderRadius="10px" bgColor={"gray.100"}>
                <Text fontSize="xl">Ticket for: <b>{event ? event.title : 'N/A'}</b></Text>
                <Text fontSize="xl">Event Date: {event ? fixedDate : 'N/A'}</Text>
                <Text fontSize="xl">Event Location: {event ? event.location : 'N/A'}</Text>
                <Text fontSize="xl">Event Description: {event ? event.description : 'N/A'}</Text>
                <Text fontSize="xl">Ticket Price: $ {ticket.price}</Text>
                <Text fontSize="2xl" fontWeight="bold" color={status === "Passed" ? "red.500" : "green.500"}>{status}</Text>

                {status === "Upcoming" ? (
                  <Box width={"100%"} justifyContent={"space-evenly"} display={"flex"}>
                    <Button color={"white"} width={"30%"} bgColor={"primary.400"} _hover={{ bgColor: "primary.500" }} borderRadius={"25px"} onClick={onTransferModalOpen}>
                      Transfer Ticket
                    </Button>
                    <Button color={"white"} width={"30%"} bgColor={"primary.400"} _hover={{ bgColor: "primary.500" }} borderRadius={"25px"} >
                      Sell Ticket
                    </Button>
                  </Box>
                ) : null}


              </Box>
              <Modal isOpen={isTransferModalOpen} onClose={onTransferModalClose} >
                <ModalOverlay />

                <ModalContent>
                  <ModalHeader fontWeight="semibold" fontSize="1.5rem">Transfer Ticket</ModalHeader>
                  <ModalCloseButton onClick={onTransferModalClose} />
                  <ModalBody>
                    <Stack spacing={4} p={4}>
                      <Input placeholder="Email" onChange={(e) => setOtherEmail(e.target.value)} />
                    </Stack>
                  </ModalBody>
                  <ModalFooter>
                    <Button color={"white"} bgColor={"primary.400"} _hover={{ bgColor: "primary.500" }} borderRadius={"25px"} onClick={handleTransfer}>Transfer</Button>
                  </ModalFooter>
                </ModalContent>

              </Modal>



            </>
          );
        })}

      </SimpleGrid>
    </Flex >
  );

}