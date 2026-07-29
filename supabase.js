const SUPABASE_URL = "https://ryaptgvvzukscesonwso.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YXB0Z3Z2enVrc2Nlc29ud3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNjYwODEsImV4cCI6MjEwMDg0MjA4MX0.axTzsxjHPZBgUCRgKHmwYNV4-Ab1QN4t8QHmCI9CvSQ";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);