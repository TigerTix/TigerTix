"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


export default async function DeleteAccount() { 
    const supabase = createClientComponentClient();
    const {data, error } = await supabase.rpc('delete_user');
    return data;
}