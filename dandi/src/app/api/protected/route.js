import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const { apiKey } = await req.json();
  const { data, error } = await supabase
    .from('api_keys')
    .select('id')
    .eq('api_key', apiKey)
    .single();

  if (data && !error) {
    return NextResponse.json({ valid: true });
  } else {
    return NextResponse.json({ valid: false });
  }
}