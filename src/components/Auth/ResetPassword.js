'use client';

import React, { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import cn from 'classnames';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, Flex, Box } from '@chakra-ui/react';

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ResetPassword = () => {
  const supabase = createClientComponentClient();
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  async function resetPassword(formData) {
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Password reset instructions sent.');
    }
  }

  return (
    <div className='flex column items-center justify-center w-full h-[100vh]' style={{ backgroundColor: "#d3d4d5" }}>
      <h1 className="text-4xl font-bold text-center" style={{ marginBottom: "40px" }}>Tiger Tix Logo</h1>
      <Flex width={"100%"}  justifyContent={"center"} align={"center"}>
        <Box bgColor={"#ebede9"} maxW={"30rem"} minW={{ md: "25rem" }} width={{ md: "60%", sm: "70%", base: "88%" }} minH={{ sm: "75%", base: "60%" }} maxH={"95%"} display={"flex"} flexDir="column" justifyContent={"center"} alignItems={"center"} borderRadius={{ sm: "2xl", base: "2xl" }}>
          <Flex flexDir={"column"} marginY={{ base: "40px" }} width={"85%"}> 
        <h2 className="w-full text-center" style={{fontSize:"2rem"}}>Forgot Password</h2>
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={ResetPasswordSchema}
          onSubmit={resetPassword}
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
                <div className="text-red-600">{String(errors.email)}</div>
              ) : <div className="text-red-600" style={{ marginBottom: "0px", marginTop: "0px" }}>&nbsp;</div>}
              <button className="button-inverse w-full" type="submit" style={{marginTop:"15px", marginBottom:"15px"}}>
                Send Instructions
              </button>
            </Form>
          )}
        </Formik>
        {errorMsg && <div className="text-center text-red-600">{errorMsg}</div>}
        {successMsg && <div className="text-center text-black">{successMsg}</div>}
        <Link href="/sign-in" className="link" my={"20px"} fontSize={"0.9rem"}>
          Remember your password? Sign In.
        </Link>
      </Flex>
    </Box>
  </Flex>
    </div>
  );
};

export default ResetPassword;
