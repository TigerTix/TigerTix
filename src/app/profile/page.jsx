"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DeleteAccount from 'src/components/Auth/DeleteAccount';
import SignOut from 'src/components/SignOut';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Text, Box, Button, Spinner, Flex, Stack, Editable, EditablePreview, useEditableControls, Input, ButtonGroup, IconButton, EditableInput } from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';


export default async function Profile() {
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [userAuth, setUserAuth] = useState(null);
  const [user, setUser] = useState([{ first_name: 'loading', last_name: 'loading', username: 'loading', role: 'loading', cuid: 'loading' }]);
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [cuid, setCuid] = useState('');


  useEffect(() => {
    // ensure this is only run when the component mounts
    router.refresh();
    supabase.auth.getUser().then((response) => {
      if (!response.data.user) {
        router.push('/sign-in');
        return;
      }
      setUserAuth(response.data.user);
      setLoading(false);

      // fetch user data

      supabase.from('profiles').select().eq('id', response.data.user.id).then((profileResponse) => {
        setUser(profileResponse.data);

        setFirstName(profileResponse.data[0].first_name);
        setLastName(profileResponse.data[0].last_name);
        setUsername(profileResponse.data[0].username);
        setRole(profileResponse.data[0].role);
        setCuid(profileResponse.data[0].cuid);
      }
      );
    });


  }, []);

  const handleFirstNameChange = async (value) => {
    setFirstName(value);

    const { error } = await supabase.from('profiles').update({ first_name: value }).eq('id', user[0].id);

    if (error) {
      console.error('Error updating first name:', error);
    }


  }

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

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls()

    return isEditing ? (
      <ButtonGroup justifyContent='center' size='sm'>
        <IconButton icon={<CheckIcon />} aria-label="Submit" {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon />} aria-label="Cancel" {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent='center'>
        <Text>Edit First Name &nbsp;</Text>
        <IconButton size='sm' icon={<EditIcon />} aria-label="Edit" {...getEditButtonProps()} />
      </Flex>
    )
  }


  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xl" thickness='4px' color='primary.500' />
      </Flex>
    );
  } 22

  return (
    <Box p={4}>
      <Stack spacing={4}>
        <Text fontSize="xl">Welcome, {firstName}!</Text>
        <Flex>
          <Editable
            textAlign='center'
            fontSize='2xl'
            isPreviewFocusable={false}
            onSubmit={handleFirstNameChange}
            flexDir={'row'}
            display={'flex'}
          >
            <EditablePreview />
            <EditableInput />
            <EditableControls />
          </Editable>
        </Flex>


        <SignOut />
        {/* Delete account button */}
        <Button onClick={handleDelete}>Delete Account</Button>
      </Stack>
    </Box>
  );
}