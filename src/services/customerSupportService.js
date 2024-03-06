'use client';

import React from 'react';
import { Button, Link, HStack, Box, Flex, Image, Hide, Show } from '@chakra-ui/react';
import Chatra from '@chatra/chatra';



export default function CustomerSupportService () {
    let Chatra = require('@chatra/chatra')

    let config = {
        setup: {
            buttonSize: 75
        },
        ID: 'Ytpn5ch5ZN3R2D9Qw'
    }

    Chatra('init', config)  
    return(
        <Button>
            <Link href="#chatraChatExpanded">Chat with us</Link>
        </Button>
    )

}