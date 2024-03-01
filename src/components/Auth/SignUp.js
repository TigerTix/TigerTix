'use client';

import React, { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import { Link, HStack, Flex, Box } from '@chakra-ui/react';
import * as Yup from 'yup';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  CUID: Yup.string().test('startsWithC', 'CUID must start with a C or be blank', value => {
    return !value || value.startsWith('C') || value.startsWith('c');
  }),
});

const SignUp = () => {
  const supabase = createClientComponentClient();
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  async function signUp(formData) {
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,

      options: {
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          CUID: formData.CUID.toUpperCase(),
        },
      },
      // redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Success! Please check your email for further instructions.');
    }
  }

  return (
    <div className='flex column items-center justify-center w-full h-[100vh]' style={{ backgroundColor: "#d3d4d5" }}>
      <Flex width={"100%"} height={"100%"} justifyContent={"center"} align={"center"}>
        <Box bgColor={"#ebede9"} minW={{ md: "25rem" }} width={{ md: "60%", sm: "70%", base: "88%" }} minH={{ sm: "75%", base: "60%" }} maxH={"95%"} display={"flex"} flexDir="column" justifyContent={"center"} alignItems={"center"} borderRadius={{ sm: "2xl", base: "2xl" }}>
          <Flex flexDir={"column"} marginY={{ base: "40px" }} width={"85%"}>
            <h2 className="w-full text-center" style={{ fontSize: "2rem" }}>Create Account</h2>
            <Formik
              initialValues={{
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                CUID: '',
              }}
              validationSchema={SignUpSchema}
              onSubmit={signUp}
            >
              {({ errors, touched }) => (
                <Form className="column w-full">
                  <label htmlFor="email">Email</label>
                  <Field
                    className={cn('input', errors.email && 'bg-red-50')}
                    id="email"
                    name="email"
                    placeholder="jane@acme.com"
                    type="email"
                  />
                  {errors.email && touched.email ? (
                    <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>{String(errors.email)}</div>
                  ) : <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>&nbsp;</div>}

                  <label htmlFor="email">Password</label>
                  <Field
                    className={cn('input', errors.password && touched.password && 'bg-red-50')}
                    id="password"
                    name="password"
                    type="password"
                  />
                  {errors.password && touched.password ? (
                    <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>{String(errors.password)}</div>
                  ) : <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>&nbsp;</div>}
                  <HStack width={"100%"} justify={"space-between"}>
                    <Flex flexDir={"column"} width={"47%"} >
                      <label htmlFor="first_name">First Name</label>
                      <Field
                        className={cn('input', errors.first_name && touched.first_name && 'bg-red-50')}
                        id="first_name"
                        name="first_name"
                        type="text"
                      />
                      {errors.first_name && touched.first_name ? (
                        <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>{String(errors.first_name)}</div>
                      ) : <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>&nbsp;</div>}
                    </Flex>
                    <Flex flexDir={"column"} width="47%" >
                      <label htmlFor="last_name">Last Name</label>
                      <Field
                        className={cn('input', errors.last_name && touched.last_name && 'bg-red-50')}
                        id="last_name"
                        name="last_name"
                        type="text"
                      />
                      {errors.last_name && touched.last_name ? (
                        <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>{String(errors.last_name)}</div>
                      ) : <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>&nbsp;</div>}
                    </Flex>
                  </HStack>
                  <label htmlFor="CUID">CUID</label>
                  <Field
                    className={cn('input', errors.CUID && touched.CUID && 'bg-red-50')}
                    id="CUID"
                    name="CUID"
                    type="text"
                  />
                  {errors.CUID && touched.CUID ? (
                    <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>{String(errors.CUID)}</div>
                  ) : <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>&nbsp;</div>}
                  <button className="button-inverse w-full" type="submit" >
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
            {errorMsg && <div className="text-red-600">{errorMsg}</div>}
            {successMsg && <div className="text-black">{successMsg}</div>}
            <Link href="/sign-in" className="link w-full" style={{ fontSize: "0.9rem", marginTop: "5px", marginBottom:"10px" }}>
              Already have an account? Sign In.
            </Link>
          </Flex>
        </Box>
      </Flex>
    </div>
  );
};

export default SignUp;
