"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DeleteAccount from 'src/components/Auth/DeleteAccount';
import SignOut from 'src/components/SignOut';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Text, Box, Button, Spinner, Flex, Stack } from '@chakra-ui/react';


export default async function Profile() {
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ensure this is only run when the component mounts
    router.refresh();
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


  async function handleDelete() {
    if (confirm('Are you sure you want to delete your account?')) {
      // const { error } = await supabase.auth.signOut({ scope: 'global' });

      // if (error) {
      //   console.error('ERROR:', error);
      // }
      
        const temp = await DeleteAccount();
        router.refresh();
        await supabase.auth.refreshSession();

        router.push('/sign-in');
        console.log('Account deleted');
      

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
        <SignOut />
        {/* Delete account button */}
        <Button onClick={handleDelete}>Delete Account</Button>
      </Stack>
    </Box>
  );
}