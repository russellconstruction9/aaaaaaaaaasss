# Vercel Environment Variables Import Script
# Run this command to import all environment variables to Vercel

# Method 1: Using Vercel CLI with .env file
vercel env pull .env.vercel
vercel env add < .env.production

# Method 2: Manual import via CLI
vercel env add GEMINI_API_KEY production
vercel env add GOOGLE_MAPS_API_KEY production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Method 3: Bulk import (copy and paste into terminal)
echo "AIzaSyCWI3oIEOvx_MB1xVSmDweT-fShPhgyGpY" | vercel env add GEMINI_API_KEY production
echo "AIzaSyCgcu2OEs4a61Dw6MUGxv93609eNDVM3uI" | vercel env add GOOGLE_MAPS_API_KEY production
echo "https://yvzdobyawqcrwwfwkiyf.supabase.co" | vercel env add VITE_SUPABASE_URL production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2emRvYnlhd3Fjcnd3ZndraXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjgxNDUsImV4cCI6MjA3ODE0NDE0NX0.-XdmgNJhVawFaJ0my37k2_sJCKht6v_h9RHvQi1LhcA" | vercel env add VITE_SUPABASE_ANON_KEY production