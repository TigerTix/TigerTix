"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, {useEffect, useState} from "react"
import {Flex, Text, Spinner, useToast, Stack, SimpleGrid, Button, Input,
    Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalBody, useDisclosure, filter,
    Select} from "@chakra-ui/react"
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash} from "react-icons/fa";

export default function EventDashboard() {
    const supabase = createClientComponentClient()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [events, setEvents] = useState(null)

    // current form input states
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [time, setTime] = useState('') // datetime
    const [location, setLocation] = useState('')
    const [type, setType] = useState('')
    const [numTickets, setNumTickets] = useState(0)
    const [ticketPrice, setTicketPrice] = useState(0)

    const [editEventID, setEditEventID] = useState(null)


    const toast = useToast()
    const router = useRouter();

    const {isOpen: isCreateEventModalOpen, onOpen: onCreateEventModalOpen, onClose: onCreateEventModalClose} = useDisclosure()
    const {isOpen: isEditEventModalOpen, onOpen: onEditEventModalOpen, onClose: onEditEventModalClose} = useDisclosure()

    const [eventSearch, setEventSearch] = useState('')
    const [filteredEvents, setFilteredEvents] = useState([])

    useEffect(() => {
        supabase.auth.getUser().then((response) => {
            if (!response.data.user) {
                router.push('/sign-in');
                return;
            }

            supabase.from('profiles').select().eq('id', response.data.user.id).then((profileResponse) => {
                if(profileResponse.data[0] && (profileResponse.data[0].role === 'vendor' || profileResponse.data[0].role === 'support')) {
                    setProfile(profileResponse.data[0]);
                    supabase.from('events').select().eq('created_by', response.data.user.id).then((response) => {
                        setEvents(response.data);
                        setFilteredEvents(response.data);
                        setLoading(false);
                    })
                } else {
                    toast({
                        title: "Unauthorized",
                        description: "You are not authorized to view this page",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                    router.push('/sign-in');
                    return;
                }
            })

            setUser(response.data.user);
        })

    }, [])

    useEffect(() => {
        if(events) {
            setFilteredEvents(events.filter((event) => {
                return event.title.toLowerCase().includes(eventSearch.toLowerCase())
            }))
        }
    }, [eventSearch]);

    const createEvent = () => {
        supabase.from('events').insert([
            {title: name, description, time, location, num_tickets: numTickets, type: type, ticket_price: ticketPrice, created_by: user.id}
        ]).select().then((response) => {
            if(response.error) {
                toast({
                    title: "Error",
                    description: response.error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                if(response.data){
                    console.log("updating events")
                    setEvents([...events, response.data[0]])
                }
                for(let i = 0; i < numTickets; i++) {
                    supabase.from('tickets').insert([
                        {event_id: response.data[0].id, price: ticketPrice, event_name: name}
                    ]).select().then((response) => {
                        if(response.error) {
                            toast({
                                title: "Error",
                                description: response.error.message,
                                status: "error",
                                duration: 9000,
                                isClosable: true,
                            })
                        }
                    }
                    )
                }
                toast({
                    title: "Success",
                    description: "Event created successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                onCreateEventModalClose()
                
            }
        })
    }

    const editEvent = () => {
        supabase.from('events').update({title: name, description, time, location, type: type, num_tickets: numTickets, ticket_price: ticketPrice}).eq('id', editEventID).select().then((response) => {
            if(response.error) {
                toast({
                    title: "Error",
                    description: response.error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: "Success",
                    description: "Event updated successfully",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                // if price of ticket has changed, update all tickets, and if the number of tickets has changed, add or remove tickets
                supabase.from('tickets').select().eq('event_id', editEventID).then((response) => {
                    if(response.error) {
                        toast({
                            title: "Error",
                            description: response.error.message,
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        })
                    } else {
                        if(response.data.length < numTickets) {
                            for(let i = 0; i < numTickets - response.data.length; i++) {
                                supabase.from('tickets').insert([
                                    {event_id: editEventID, owner_id: null}
                                ]).then((response) => {
                                    if(response.error) {
                                        toast({
                                            title: "Error",
                                            description: response.error.message,
                                            status: "error",
                                            duration: 9000,
                                            isClosable: true,
                                        })
                                    } else {
                                        supabase.from('tickets').update({price: ticketPrice, event_name: name}).eq('event_id', editEventID).then((response) => {
                                            if(response.error) {
                                                toast({
                                                    title: "Error",
                                                    description: response.error.message,
                                                    status: "error",
                                                    duration: 9000,
                                                    isClosable: true,
                                                })
                                            }
                                        })
                                    }
                                }
                                )
                            }
                        } else if(response.data.length > numTickets) {
                            for(let i = 0; i < response.data.length - numTickets; i++) {
                                supabase.from('tickets').delete().eq('id', response.data[i].id).then((response) => {
                                    if(response.error) {
                                        toast({
                                            title: "Error",
                                            description: response.error.message,
                                            status: "error",
                                            duration: 9000,
                                            isClosable: true,
                                        })
                                    } else {
                                        supabase.from('tickets').update({price: ticketPrice}).eq('event_id', editEventID).then((response) => {
                                            if(response.error) {
                                                toast({
                                                    title: "Error",
                                                    description: response.error.message,
                                                    status: "error",
                                                    duration: 9000,
                                                    isClosable: true,
                                                })
                                            }
                                        })
                                    }
                                }
                                )
                            }
                        }
                    }
                })

                

                onEditEventModalClose()
                setEvents(events.map((event) => {
                    if(event.id === editEventID) {
                        return {...event, title: name, description, time, location}
                    }
                    return event
                }))
            }
        })
    }


    if (loading) {
        return (
            <Flex align="center" justify="center" h="100vh">
                <Spinner size="xl" thickness='4px' color='primary.500' />
            </Flex>
        );
    }



    return (
       <>
        <Flex direction="column" align="center" p={4}>
            <Text fontSize="4rem" fontWeight="bold" mb={4}>Event Dashboard</Text>
            <Stack direction="row" spacing={4} mb={4}>
            <Input placeholder="Search events" value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} />
            <Button leftIcon={<FaPlus/>} colorScheme="primary" px="2rem" onClick={onCreateEventModalOpen}>Create Event</Button>
                
            </Stack>
            <SimpleGrid columns={2} spacing="2rem" w="80%">
                {/* Render the events in card format */}
                {filteredEvents && filteredEvents.map((event) => (
                    <Stack key={event.id} gap={2} h="19rem" bg="gray.100" borderRadius="10px" align="center" p="1rem">
                        <Flex w="100%" justify="space-between">
                            <Flex cursor="pointer" onClick={() => {
                                onEditEventModalOpen()
                                setName(event.title)
                                setDescription(event.description)
                                setTime(event.time)
                                setLocation(event.location)
                                setType(event.type)
                                setNumTickets(event.num_tickets)
                                setTicketPrice(event.ticket_price)
                                setEditEventID(event.id)
                            
                            }}>
                                <FaEdit/>
                            </Flex>
                            <Flex cursor="pointer" onClick={() => {
                                supabase.from('events').delete().eq('id', event.id).then((response) => {
                                    if(response.error) {
                                        toast({
                                            title: "Error",
                                            description: response.error.message,
                                            status: "error",
                                            duration: 9000,
                                            isClosable: true,
                                        })
                                    } else {
                                        toast({
                                            title: "Success",
                                            description: "Event deleted successfully",
                                            status: "success",
                                            duration: 9000,
                                            isClosable: true,
                                        })
                                        setEvents(events.filter((e) => e.id !== event.id))
                                    }
                                })
                            }}>
                                <FaTrash/>
                            </Flex>
                        </Flex>
                        <Text fontWeight="semibold" fontSize="1.5rem">{event.title || "No Title"}</Text>
                        <Text fontSize="1.2rem" color="gray.800">{event.description || "No Description"}</Text>
                        <Text fontSize="1rem" color="gray.700">Location: {event.location || "No Location"}</Text>
                        <Text fontSize="1rem" color="gray.700">Time: {new Date(event.time).toLocaleString()}</Text>
                        <Text fontSize="1rem" color="gray.700">Type: {event.type || "No Type"}</Text>
                        <Text fontSize="1rem" color="gray.700">Tickets: {event.num_tickets || "NULL"}</Text>
                        <Text fontSize="1rem" color="gray.700">Price: {event.ticket_price || "NULL"}</Text>
                    </Stack>
                ))}
            </SimpleGrid>
        </Flex>

        <Modal isOpen={isCreateEventModalOpen} onClose={onCreateEventModalClose}>

            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontWeight="semibold" fontSize="1.5rem">Create Event</Text>
                    <Stack spacing={4} p={4}> 
                        <Input placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <Input placeholder="Event Time" value={time} type="datetime-local" onChange={(e) => setTime(e.target.value)} />
                        <Input placeholder="Event Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                        <Select placeholder="All Events" w="20rem" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="Concerts">Concerts</option>
                            <option value="Sports">Sports</option>
                            <option value="Theater">Theater</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Festivals">Festivals</option>
                            <option value="Exhibitions and Expos">Exhibitions and Expos</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                        </Select>
                        <Input placeholder="Number of Tickets" value={numTickets} onChange={(e) => setNumTickets(Number(e.target.value))} />
                        <Input placeholder="Ticket Price" value={ticketPrice} onChange={(e) => setTicketPrice(Number(e.target.value))} />
                        <Button colorScheme="primary" onClick={createEvent}>Create Event</Button>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>

        <Modal isOpen={isEditEventModalOpen} onClose={onEditEventModalClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontWeight="semibold" fontSize="1.5rem">Edit Event</Text>
                    <Stack spacing={4} p={4}>
                        <Input placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <Input placeholder="Event Time" value={time} type="datetime-local" onChange={(e) => setTime(e.target.value)} />
                        <Input placeholder="Event Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                        <Select placeholder="All Events" w="20rem" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="Concerts">Concerts</option>
                            <option value="Sports">Sports</option>
                            <option value="Theater">Theater</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Festivals">Festivals</option>
                            <option value="Exhibitions and Expos">Exhibitions and Expos</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                        </Select>
                        <Input placeholder="Number of Tickets" value={numTickets} onChange={(e) => setNumTickets(Number(e.target.value))} />
                        <Input placeholder="Ticket Price" value={ticketPrice} onChange={(e) => setTicketPrice(Number(e.target.value))} />
                        <Button colorScheme="primary" onClick={editEvent}>Edit Event</Button>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
        
    )

}