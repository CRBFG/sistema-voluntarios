const SUPABASE_URL = "https://rkhoebcawwsukznhccqu.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraG9lYmNhd3dzdWt6bmhjY3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NzUwODcsImV4cCI6MjA4ODI1MTA4N30.J_SE_HLOR4crob7JUGA2mNljHzKFUMrJjucD6puC2l8";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);