import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nvrjahggaxgjuzapadfe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cmphaGdnYXhnanV6YXBhZGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTUyNzgsImV4cCI6MjEwMjQ3MTI3OH0.3GsynkKnpsprcYSMLzAU4OLLn_zEkYu5jzBbSoF8G6g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
