import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hgwbelpkzsrcnotnalst.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd2JlbHBrenNyY25vdG5hbHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODQ1MDUsImV4cCI6MjA3MTg2MDUwNX0.HAeiUWUrbKnSjW6BxXaNfKtWMb1OmyBxvJ1CNPTMFvs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
