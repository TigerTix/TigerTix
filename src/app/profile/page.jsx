"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DeleteAccount from 'src/components/Auth/DeleteAccount';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Text, Box, Button, Spinner, Flex, Stack } from '@chakra-ui/react';
import SignOut from 'src/components/SignOut';




export default async function Profile() {
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
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

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // eslint-disable-next-line no-console
      console.error('ERROR:', error);
    } else {
      router.push('/sign-in');
    }
  }

  async function handleDelete() {
    const response = await DeleteAccount();
    if (response.error) {
      // eslint-disable-next-line no-console
      console.error('ERROR:', response.error);
      return;
    }else{
      router.push('/sign-in');
    }
  }


  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xl" thickness='4px' color='primary.500' />
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Stack spacing={4}>
        <Text fontSize="xl">Welcome, {user.email}</Text>
        <Button onClick={handleSignOut}>Sign Out</Button>
        {/* Delete account button */}
        <Button onClick={handleDelete}>Delete Account</Button>
      </Stack>
    </Box>
  );
}