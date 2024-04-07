"use client";

import React, {useEffect, useState} from "react";
import {Flex, Spinner, useToast, Text, Stack, Button, Input, Box, Divider, AbsoluteCenter} from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AddVendorPage() {
    const [loading, setLoading] = React.useState(true);
    const [user, setUser] = React.useState();
    const [search, setSearch] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);

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

            supabase.from("profiles").select().eq("id", response.data.user.id).then((profileResponse) => {
                if(profileResponse.data[0].role !== "support") {
                    toast({
                        title: "You must be a support role to view this page",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                    router.push("/main");
                    return;
                }
                setUser(profileResponse.data[0]);
                setLoading(false);
            });
            performSearch();
        });
    }
    , []);

    const performSearch = () => {
        supabase.from("profiles").select().ilike("email", `%${search}%`).then((response) => {
            setSearchResults(response.data);
        });
    }

    const changeToVendor = (id) => {
        console.log(id)
        supabase.from("profiles").update({role: "vendor"}).eq("id", id).select().then((response) => {
            console.log(response)
            toast({
                title: "Account updated to vendor",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        });
    }


    if(loading) {
        return (
            <Flex align="center" justify="center" h="100vh" w="100vh">
                <Spinner />
            </Flex>
        );
    }

    return (
        <Flex direction="column" align="center" h="100vh">
            <Flex>
                <Button onClick={() => {router.push("/main")}}>Home</Button>
            </Flex>
            <Stack  mt="10rem" spacing={4} w="40rem" p="2rem" borderRadius="10px" bg="gray.50">
                <Text fontSize="2rem" fontWeight="bold">Search For Account</Text>
                <Flex gap="2rem">
                    <Input placeholder="Account Email Address" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => {if(e.code === "Enter") {performSearch();}}}/>
                    <Button colorScheme="primary" onClick={performSearch}>Search</Button>
                </Flex>
                <Divider />
                {searchResults && searchResults.map((result) => (
                    <Stack key={result.id} w="100%">
                        <Flex align="center" justify="space-between" w="100%">
                            <Text>{result.email}</Text>
                            <Button colorScheme="primary" onClick={(e) => {changeToVendor(result.id)}}>Change Account To Vendor</Button>
                        </Flex>
                        <Divider />
                    </Stack>
                ))}


            </Stack>
        </Flex>
    );


}