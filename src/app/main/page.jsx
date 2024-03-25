"use client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import SignOut from 'src/components/SignOut';
import { Spinner, Flex, Button } from '@chakra-ui/react';

export default async function Home() {
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState([{ role: 'loading' }]);
  const router = useRouter();



  useEffect(() => {
    router.refresh();
    // ensure this is only run when the component mounts
    supabase.auth.getUser().then((response) => {
      console.log(response.data.user)
      if (!response.data.user) {
        router.push('/sign-in');
        return;
      }
      setAuthUser(response.data.user);

      supabase.from('profiles').select().eq('id', response.data.user.id).then((profileResponse) => {
        setUser(profileResponse.data);
      });

      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xl" thickness='4px' color='primary.500' />
      </Flex>
    );
  }

  return (
    <div className="card">
      <h2>Welcome!</h2>
      <code className="highlight">{user[0].role}</code>
      <Flex flexDir={"column"} h={user[0].role === 'vendor' ? "150px" : "100px"} justify={"space-between"} >

      {user[0].role === 'vendor' && (
        <Button color={"white"} width={"100%"} bgColor={"primary.400"} _hover={{bgColor:"primary.500"}} borderRadius={"25px"} onClick={() => {router.push("/events/dashboard")}}>
          Go to Event Dashboard
        </Button>
      )}

      <Button color={"white"} width={"100%"} bgColor={"primary.400"} _hover={{bgColor:"primary.500"}} borderRadius={"25px"} onClick={() => {router.push("/ticket-marketplace")}}>
          Go to Ticket Marketplace
        </Button>

        <Button color={"white"} width={"100%"} bgColor={"primary.400"} _hover={{bgColor:"primary.500"}} borderRadius={"25px"} onClick={() => {router.push("/profile")}}>
          Go to Profile
        </Button>

        <SignOut />
      </Flex>
    </div>
  );
}