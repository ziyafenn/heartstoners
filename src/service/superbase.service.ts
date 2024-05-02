import { Database } from "@/types/superbase.type";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  "https://xuukonllnvcmxdezpfmz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1dWtvbmxsbnZjbXhkZXpwZm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM4MTg2OTgsImV4cCI6MjAyOTM5NDY5OH0.GDcL3Dd6XNnrF9VeYfHBR4FttXzlIqgrSY9svsDFcSk"
);
