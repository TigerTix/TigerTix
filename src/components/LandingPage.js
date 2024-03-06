'use client';

import React, { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import { Link, HStack, Box, Flex, Image, Hide, Show, Button, VisuallyHidden } from '@chakra-ui/react';
import * as Yup from 'yup';

const LandingPage = () => {
    return (
        <div style={{ background: "url(background.jpg) no-repeat fixed center", backgroundSize: "100vw 100vh",  width: "100vw", height: "100vh", overflow: 'hidden'} }>
            <h1 style={{ fontSize: "2.5rem", textAlign: "center", margin: "2rem 0" }}>
                Welcome to Tiger Tix
            </h1>
            <p style={{ fontSize: "1.2rem", textAlign: "center", margin: "1rem 0" }}>
            Your ultimate destination for hassle-free ticket booking!
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
            <Link href="/sign-up" marginX={"5px"}>
                <Button bgColor={"primary.400"}>
                Get Started
                </Button>
            </Link>
            <Link href="/sign-in" marginX={"5px"}>
                <Button colorScheme='blue'>
                Login
                </Button>
            </Link>
            </div>
      </div>
    );
};
export default LandingPage;