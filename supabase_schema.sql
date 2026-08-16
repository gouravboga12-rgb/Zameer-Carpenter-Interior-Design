-- Supabase SQL Schema DDL for Zameer Carpenter & Interior Design

-- 1. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    numeric_id INT,
    title TEXT NOT NULL,
    short_title TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    highlight TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    subservices JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Projects & Media Table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    materials TEXT NOT NULL,
    scope TEXT NOT NULL,
    image TEXT NOT NULL,
    type TEXT DEFAULT 'image',
    video_url TEXT,
    poster TEXT,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Service Inquiries Table (From Service Specific Forms)
CREATE TABLE IF NOT EXISTS public.service_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id TEXT,
    service_title TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT,
    property_type TEXT,
    notes TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Contact Inquiries Table (From Contact Page Consultation Form)
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    location TEXT,
    property_type TEXT,
    project_timeline TEXT,
    notes TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Company Settings Table (Phone & WhatsApp numbers)
CREATE TABLE IF NOT EXISTS public.company_settings (
    id INT PRIMARY KEY DEFAULT 1,
    phone TEXT NOT NULL,
    phone_raw TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    whatsapp_raw TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable Row Level Security (RLS) or enable public read/write for public anon role
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings DISABLE ROW LEVEL SECURITY;
