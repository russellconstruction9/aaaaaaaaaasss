# Copy these commands to set up environment variables in Vercel CLI

# First, login to Vercel
vercel login

# Set production environment variables
vercel env add GEMINI_API_KEY production
# Enter your Gemini API key when prompted

vercel env add GOOGLE_MAPS_API_KEY production
# Enter your Google Maps API key when prompted

vercel env add VITE_SUPABASE_URL production
# Enter your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
# Enter your Supabase anonymous key when prompted

# Set preview environment variables (same values as production)
vercel env add GEMINI_API_KEY preview
vercel env add GOOGLE_MAPS_API_KEY preview
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_ANON_KEY preview

# Set development environment variables (same values or test keys)
vercel env add GEMINI_API_KEY development
vercel env add GOOGLE_MAPS_API_KEY development
vercel env add VITE_SUPABASE_URL development
vercel env add VITE_SUPABASE_ANON_KEY development

# Optional: Set NODE_ENV (usually set automatically)
# vercel env add NODE_ENV production
# vercel env add NODE_ENV preview
# vercel env add NODE_ENV development

# Verify your environment variables
vercel env ls

# Deploy to production
vercel --prod