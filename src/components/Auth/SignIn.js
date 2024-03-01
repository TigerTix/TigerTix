'use client';

import React, { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import { Link, HStack, Box, Flex, Image, Hide, Show } from '@chakra-ui/react';
import * as Yup from 'yup';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const SignIn = () => {
  const supabase = createClientComponentClient();
  const [errorMsg, setErrorMsg] = useState(null);

  async function signIn(formData) {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
    }
  }

  return (
    <div className='flex column items-center justify-center w-full h-[100vh]' style={{ backgroundColor: "var(--chakra-colors-gray-300)" }}>
      <HStack spacing={"0"} width={"100%"} justify={{md:"space-between", sm:"center", base:"center"}} height={"100%"}>
        <Show breakpoint='(min-width: 48em)'> 
        {/* 768px */}
          <Flex width="100%" height="100%" >
            <Image pos={"relative"} height={"100%"} maxWidth="100%" width="fit" src='change-this.jpg'></Image>
          </Flex>
        </Show>
        <Box minW={{md:"22rem"}} width={{md:"40%", sm:"70%", base:"88%"}} h={{md:"100%"}} minH={{sm:"75%", base:"60%"}} bgColor={{md:"var(--chakra-colors-gray-200)", sm:"#ebede9", base:"#ebede9"}} display={"flex"} justifyContent={"center"} alignItems={"center"} borderRadius={{sm:"2xl", base:"2xl"}}>
          <Flex flexDir={"column"} marginY={{base:"40px"}} >
            <h2 className="w-full text-center" style={{ color: "var(--chakra-colors-black)" }}>Welcome Back!</h2>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={SignInSchema}
              onSubmit={signIn}
            >
              {({ errors, touched }) => (
                <Form className="column w-full">
                  <label htmlFor="email">Email</label>
                  <Field
                    className={cn('input', errors.email && touched.email && 'bg-red-50')}
                    id="email"
                    name="email"
                    placeholder="tiger@tix.com"
                    type="email"
                  />
                  {errors.email && touched.email ? (
                    <div className="text-red-500">{String(errors.email)}</div>
                  ) : <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>&nbsp;</div>}

                  <label htmlFor="email">Password</label>
                  <Field
                    className={cn('input', errors.password && touched.password && 'bg-red-50')}
                    id="password"
                    name="password"
                    type="password"
                  />
                  {errors.password && touched.password ? (
                    <div className="text-red-600">{String(errors.password)}</div>
                  ) : <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>&nbsp;</div>}

                  <Link href="/reset-password" className="link w-full"mb={"10px"} >
                    Forgot your password?
                  </Link>

                  <button className="button-inverse w-full" type="submit">
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
            {errorMsg && <div className="text-red-600">{errorMsg}</div>}
            <Link href="/sign-up" className="link w-full" my={"20px"}>
              Don&apos;t have an account? Sign Up.
            </Link>
          </Flex>
        </Box>
      </HStack>
    </div>
  );
};

export default SignIn;