# ✅ FIXED: Vercel Environment Variables Setup

## 🚨 Issue Fixed
Removed the problematic `@` secret references from `vercel.json`. Now you can set environment variables directly in Vercel dashboard.

## 📋 Step-by-Step Setup

### Method 1: Vercel Dashboard (Recommended)

1. **Go to your Vercel project dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Navigate to Environment Variables**
   - Click: Settings → Environment Variables

3. **Add each variable:**

   | Variable Name | Value | Type | Environment |
   |---------------|-------|------|-------------|
   | `GEMINI_API_KEY` | `AIzaSyCWI3oIEOvx_MB1xVSmDweT-fShPhgyGpY` | **Sensitive** | Production, Preview, Development |
   | `GOOGLE_MAPS_API_KEY` | `AIzaSyCgcu2OEs4a61Dw6MUGxv93609eNDVM3uI` | **Sensitive** | Production, Preview, Development |
   | `VITE_SUPABASE_URL` | `https://yvzdobyawqcrwwfwkiyf.supabase.co` | Plain Text | Production, Preview, Development |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2emRvYnlhd3Fjcnd3ZndraXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjgxNDUsImV4cCI6MjA3ODE0NDE0NX0.-XdmgNJhVawFaJ0my37k2_sJCKht6v_h9RHvQi1LhcA` | Plain Text | Production, Preview, Development |

4. **For each variable:**
   - Click "Add New"
   - Enter Variable Name (exactly as shown above)
   - Enter Value (copy from table above)
   - Select Type (Sensitive for API keys, Plain Text for VITE_ variables)
   - Check: Production, Preview, Development
   - Click "Save"

### Method 2: Vercel CLI

```bash
# Login to Vercel
vercel login

# Set each environment variable
vercel env add GEMINI_API_KEY production
# When prompted, paste: AIzaSyCWI3oIEOvx_MB1xVSmDweT-fShPhgyGpY

vercel env add GOOGLE_MAPS_API_KEY production
# When prompted, paste: AIzaSyCgcu2OEs4a61Dw6MUGxv93609eNDVM3uI

vercel env add VITE_SUPABASE_URL production
# When prompted, paste: https://yvzdobyawqcrwwfwkiyf.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# When prompted, paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2emRvYnlhd3Fjcnd3ZndraXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjgxNDUsImV4cCI6MjA3ODE0NDE0NX0.-XdmgNJhVawFaJ0my37k2_sJCKht6v_h9RHvQi1LhcA

# Verify variables are set
vercel env ls

# Deploy
vercel --prod
```

## 🔍 Important Notes

- ✅ **Removed problematic `@` references from vercel.json**
- ✅ **Use exact variable names (case-sensitive)**
- ✅ **Set API keys as "Sensitive" type**
- ✅ **Set VITE_ variables as "Plain Text"**
- ✅ **Apply to all environments: Production, Preview, Development**

## 🚀 Deploy After Setup

Once environment variables are properly set:

```bash
vercel --prod
```

Your deployment should now work without the secret reference error!