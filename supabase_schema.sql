-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- 1. Create Users Table
CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  role text DEFAULT 'user'::text,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Create Foods Table
CREATE TABLE public.foods (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  type text NOT NULL,
  restaurant text NOT NULL,
  rating numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Create Orders Table
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  delivery_address text NOT NULL,
  payment_method text NOT NULL,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Disable Row Level Security (RLS) for testing purposes
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
