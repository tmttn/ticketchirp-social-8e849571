
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://eyohgebecaeivoxylknj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5b2hnZWJlY2FlaXZveHlsa25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMzc1NzgsImV4cCI6MjA1NzYxMzU3OH0.RU82gf6qVqhU2ZSvkJJdE9ZNTkyEObo1LuNtYJVt0Sw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);
