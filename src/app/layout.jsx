import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import CustomChakraProvider from '../components/CustomChakraProvider';
import AuthProvider from '../components/AuthProvider';
import CustomerSupportService from '../services/customerSupportService';
import "../styles/globals.css"

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
        <body>
        <CustomChakraProvider>{/* custom <ChakraProvider> */}
            <main>
              <AuthProvider accessToken={session?.access_token}>{children}</AuthProvider>
            </main>
            <footer>
              <CustomerSupportService />
            </footer>
          </CustomChakraProvider>
        </body>
    </html>
  );
}
