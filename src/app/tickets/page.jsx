"use client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import SignOut from 'src/components/SignOut';
import { Spinner, Flex, Button, Text, Box, SimpleGrid, useToast, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalCloseButton, ModalFooter, Stack, Input, Tooltip } from '@chakra-ui/react';
import moment from 'moment';

export default function TicketView() {
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [events, setEvents] = useState(null);
  const [event, setEvent] = useState(null);
  const [otherEmail, setOtherEmail] = useState('');
  const [newPrice, setNewPrice] = useState('');


  const router = useRouter();
  const toast = useToast();


  const { isOpen: isTransferModalOpen, onOpen: onTransferModalOpen, onClose: onTransferModalClose } = useDisclosure()
  const { isOpen: isSellModalOpen, onOpen: onSellModalOpen, onClose: onSellModalClose } = useDisclosure()
  const { isOpen: isRemoveModalOpen, onOpen: onRemoveModalOpen, onClose: onRemoveModalClose } = useDisclosure()


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

    if (!ticket) {
      toast({
        title: "Error",
        description: "Please select a ticket",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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

    if (ticket.owner_id !== user.id) {
      toast({
        title: "Error",
        description: "You do not own this ticket",
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


    const { error: transferError } = await supabase.from('tickets').update({ owner_id: data[0].id }).eq('id', ticket.id);

    const { error: resaleError } = await supabase.from('tickets').update({ resale: false }).eq('id', ticket.id);

    if (transferError || resaleError) {
      console.error('Error transferring ticket:', transferError);
      // Handle error appropriately in your app
      toast({
        title: "Error",
        description: "Error transferring ticket. Contact support.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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

  const handleSell = async () => {

    if (!newPrice || isNaN(parseFloat(newPrice))) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // sets newprice to be a number
    var tempPrice = parseFloat(newPrice);

    if (tempPrice <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (ticket.owner_id !== user.id) {
      toast({
        title: "Error",
        description: "You do not own this ticket",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }


    const { error: transferError } = await supabase.from('tickets').update({ resale: true }).eq('id', ticket.id);
    if (transferError) {
      console.error('Error selling ticket:', transferError);
      // Handle error appropriately in your app
      toast({
        title: "Error",
        description: "Error selling ticket. Contact support.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (ticket.resale) {
      toast({
        title: "Error",
        description: "Ticket already listed for sale",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    const { error: priceError } = await supabase.from('tickets').update({ price: tempPrice }).eq('id', ticket.id);
    if (priceError) {
      console.error('Error selling ticket:', priceError);
      // Handle error appropriately in your app
      toast({
        title: "Error",
        description: "Error selling ticket. Contact support.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }


    toast({
      title: "Success",
      description: "Ticket listed for sale",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // refresh the page

    onSellModalClose();
    refreshTickets();
  }

  const handleRemove = async () => {

    if (!ticket) {
      toast({
        title: "Error",
        description: "Please select a ticket",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!ticket.resale) {
      toast({
        title: "Error",
        description: "Ticket not listed for sale",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (ticket.owner_id !== user.id) {
      toast({
        title: "Error",
        description: "You do not own this ticket",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { error: transferError } = await supabase.from('tickets').update({ resale: false }).eq('id', ticket.id);


    const { error: priceError } = await supabase.from('tickets').update({ price: event.ticket_price }).eq('id', ticket.id);

    if (transferError || priceError) {
      console.error('Error selling ticket:', transferError);
      // Handle error appropriately in your app
      toast({
        title: "Error",
        description: "Error removing ticket from marketplace. Contact support.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Ticket removed from marketplace",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onRemoveModalClose();
    refreshTickets();

  }

  const handleCalendar = (event) => {


    if (!event) {
      toast({
        title: "Error",
        description: "Please select an event",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Add to Google Calendar

    
    // making starte time to ISO string

    let startTime = moment(event.time).toISOString().replace(/[-:.]/g, '');

    //making end time 4 hours after start time
    let endTime = moment(event.time).add(4, 'hours').toISOString().replace(/[-:.]/g, '');

    // Create a new event
    const tempEvent = {
      title: event.title,
      description: event.description,
      location: event.location,
      start: startTime,
      end: endTime,
    };

    
    

    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${tempEvent.title}&details=${tempEvent.description}&location=${tempEvent.location}&dates=${tempEvent.start}/${tempEvent.end}&stz=America/New_York&etz=America/New_York`, '_blank');

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
      <SimpleGrid columns={2} spacing="1.5rem" w="85%" marginY={"15px"}>
        {tickets && tickets.map((ticket) => {
          if (!events) return null;

          const event = events.find(e => e.id === ticket.event_id);

          const currentDate = moment();
          const eventDate = moment(event ? event.time : null);

          let status = currentDate.isBefore(eventDate) ? 'Upcoming' : 'Passed';
          
          const happeningTime = moment(eventDate).add(4, 'hours');
          if (status === 'Upcoming' && currentDate.isAfter(eventDate) && currentDate.isBefore(happeningTime)){
            status = 'Happening Now';
          }

          const fixedDate = eventDate.format('MMMM Do YYYY, h:mm:ss a');

          return (
            <>
              <Box key={ticket.id} p={5} shadow="md" borderWidth="1px" borderRadius="10px" bgColor={"gray.100"} position={"relative"}>
                {status === "Upcoming" || status ===  "Happening Now" ? (
                  <Tooltip label="Add to Google Calendar" aria-label="Add to Google Calendar">
                    <Button color={"white"} bgColor={"primary.400"} _hover={{ bgColor: "primary.500" }} borderRadius={"25px"} position={"absolute"} right={"5px"} top={"5px"} onClick={() => handleCalendar(event)}>
                      +
                    </Button>
                  </Tooltip>
                ) : null}
                <Text fontSize="xl">Ticket for: <b>{event ? event.title : 'N/A'}</b></Text>
                <Text fontSize="xl">Event Date: {event ? fixedDate : 'N/A'}</Text>
                <Text fontSize="xl">Event Location: {event ? event.location : 'N/A'}</Text>
                <Text fontSize="xl">Event Description: {event ? event.description : 'N/A'}</Text>
                <Text fontSize="xl">Ticket Price: $ {ticket.price}</Text>
                <Text fontSize="2xl" fontWeight="bold" color={status === "Passed" ? "red.500" : "green.500"}>{status}</Text>

                {ticket.resale ? (
                  <Text fontSize="xl" color={"red.500"}>Ticket listed for sale</Text>
                ) : <Text fontSize={"xl"} >&nbsp;</Text>}

                {status === "Upcoming" ? (
                  
                  <Box width={"100%"} justifyContent={"space-evenly"} display={"flex"}>
                    <Button color={"white"} width={"30%"} bgColor={"primary.400"} _hover={{ bgColor: "primary.500" }} borderRadius={"25px"} onClick={() => { onTransferModalOpen(); setTicket(ticket); }}>
                      Transfer Ticket
                    </Button>
                    {ticket.resale ? (
                      <Button color={"white"} width={"30%"} bgColor={"red.400"} _hover={{ bgColor: "red.500" }} borderRadius={"25px"} onClick={() => { onRemoveModalOpen(); setTicket(ticket); setEvent(event); }}>
                        Remove from Sale
                      </Button>
                    ) :
                      <Button color={"white"} width={"30%"} bgColor={"primary.400"} _hover={{ bgColor: "primary.500" }} borderRadius={"25px"} onClick={() => { onSellModalOpen(); setTicket(ticket); }} >
                        Sell Ticket
                      </Button>
                    }
                  </Box>
                ) : null}



              </Box>
              <Modal isOpen={isTransferModalOpen} onClose={onTransferModalClose} >
                <ModalOverlay style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} />

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

              <Modal isOpen={isSellModalOpen} onClose={onSellModalClose} >
                <ModalOverlay style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} />

                <ModalContent>
                  <ModalHeader fontWeight="semibold" fontSize="1.5rem">Sell Ticket</ModalHeader>
                  <ModalCloseButton onClick={onSellModalClose} />
                  <ModalBody>
                    <Stack spacing={4} p={4}>
                      <Input placeholder="Price" onChange={(e) => setNewPrice(e.target.value)} />
                    </Stack>
                  </ModalBody>
                  <ModalFooter>
                    <Button color={"white"} bgColor={"primary.400"} _hover={{ bgColor: "primary.500" }} borderRadius={"25px"} onClick={handleSell}>Sell</Button>
                  </ModalFooter>
                </ModalContent>

              </Modal>

              <Modal isOpen={isRemoveModalOpen} onClose={onRemoveModalClose} >
                <ModalOverlay style={{ backgroundColor: 'rgba(0,0,0,0.2)' }} />

                <ModalContent>
                  <ModalHeader fontWeight="semibold" fontSize="1.5rem">Remove from Sale</ModalHeader>
                  <ModalCloseButton onClick={onRemoveModalClose} />
                  <ModalBody>
                    <Stack spacing={4} p={4}>
                      <Text>Are you sure you want to remove this ticket from sale?</Text>
                    </Stack>
                  </ModalBody>
                  <ModalFooter>
                    <Button color={"white"} bgColor={"red.400"} _hover={{ bgColor: "red.500" }} borderRadius={"25px"} onClick={handleRemove}>Remove</Button>
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