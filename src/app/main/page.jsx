"use client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import SignOut from 'src/components/SignOut';
import { Spinner, Flex, Button } from '@chakra-ui/react';

export default async function Home() {
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
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
      setUser(response.data.user);
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
      <code className="highlight">{user.role}</code>
      <Flex flexDir={"column"} h={"100px"} justify={"space-between"} >
        <Button color={"white"} width={"100%"} bgColor={"primary.400"} _hover={{bgColor:"primary.500"}} borderRadius={"25px"} onClick={() => {router.push("/profile")}}>
          Go to Profile
        </Button>
        <SignOut />
      </Flex>
    </div>
  );
}