// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yxchzmkrrefdgrbnqoxj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Y2h6bWtycmVmZGdyYm5xb3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDY1MDcsImV4cCI6MjA1MDEyMjUwN30.4X6u_ikpRtQUBL59iD7AXFC0RwKSS2gIszQuop3WkMw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);