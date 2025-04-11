import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hwvyaeyyeddzyxprpjmn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dnlhZXl5ZWRkenl4cHJwam1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjM5MjMsImV4cCI6MjA1OTc5OTkyM30.wlw-vbWltz3Fqjus8HK6kmuC3FaiWe1OW2RnzCH0LgM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
