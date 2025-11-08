# Environment Variables Setup for Vercel

## 🔧 Quick Setup Instructions

### Method 1: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Navigate to project directory
cd your-project-directory

# Set environment variables using CLI
vercel env add GEMINI_API_KEY
vercel env add GOOGLE_MAPS_API_KEY
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Method 2: Using Vercel Dashboard
1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable from the list below

## 📋 Environment Variables List

Copy and paste these variables into your Vercel dashboard:

### Required Variables

| Variable Name | Type | Environments | Description |
|---------------|------|--------------|-------------|
| `GEMINI_API_KEY` | Secret | Production, Preview, Development | Google Gemini AI API key |
| `GOOGLE_MAPS_API_KEY` | Secret | Production, Preview, Development | Google Maps API key |
| `VITE_SUPABASE_URL` | Plain Text | Production, Preview, Development | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Plain Text | Production, Preview, Development | Supabase anonymous key |

### Optional Variables

| Variable Name | Value | Environments | Description |
|---------------|-------|--------------|-------------|
| `NODE_ENV` | `production` | Production | Node environment |
| `NODE_ENV` | `preview` | Preview | Node environment |
| `NODE_ENV` | `development` | Development | Node environment |

## 🔐 Getting Your API Keys

### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key value

### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create credentials → API Key
4. Copy the key value

### Supabase Keys
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon public key

## ⚡ Bulk Import (CLI Method)

Create a `.env.production` file locally with your values:
```bash
GEMINI_API_KEY=your_actual_key_here
GOOGLE_MAPS_API_KEY=your_actual_key_here
VITE_SUPABASE_URL=your_actual_url_here
VITE_SUPABASE_ANON_KEY=your_actual_key_here
```

Then run:
```bash
vercel env pull .env.vercel
```

## ⚠️ Security Notes

- **NEVER** commit actual API keys to Git
- Use "Secret" type for sensitive keys (GEMINI_API_KEY, GOOGLE_MAPS_API_KEY)
- VITE_ prefixed variables are safe for client-side (automatically public)
- Always use different keys for production vs development when possible

## 🚀 Deploy After Setup

Once environment variables are configured:
```bash
vercel --prod
```

Your app will deploy with all environment variables properly configured!