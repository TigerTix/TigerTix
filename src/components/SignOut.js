'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@chakra-ui/react';

export default function SignOut() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut({ scope: 'global' });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('ERROR:', error);
    } else {
      await supabase.auth.refreshSession();
      router.refresh();
      router.push('/sign-in');
    }
  }

  return (
    <Button color={"white"} width={"100%"} bgColor={"primary.400"} _hover={{bgColor:"primary.500"}} borderRadius={"25px"} onClick={handleSignOut}>Sign Out</Button>
  );
}
