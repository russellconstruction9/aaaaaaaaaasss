# Vercel Deployment Workflow

## 🚀 Complete Deployment Process

### Step 1: Deploy to Vercel
```bash
vercel --prod
```

### Step 2: Get Your Live URL
After deployment, Vercel will provide a URL like:
- `https://aaaaaaaaaasss.vercel.app`
- `https://your-project-name.vercel.app`

### Step 3: Update Supabase (CRITICAL!)

**Go to Supabase Dashboard:**
1. https://supabase.com/dashboard/project/yvzdobyawqcrwwfwkiyf
2. Authentication → Settings → URL Configuration

**Add These URLs:**

**Site URL:**
```
https://[YOUR-VERCEL-URL]
```

**Additional Redirect URLs:**
```
https://[YOUR-VERCEL-URL]
https://[YOUR-VERCEL-URL]/auth/callback
https://[YOUR-VERCEL-URL]/**
https://*.vercel.app/**
localhost:3000
http://localhost:3000
```

**Example with actual URL:**
If your Vercel URL is `https://aaaaaaaaaasss.vercel.app`, then add:
```
https://aaaaaaaaaasss.vercel.app
https://aaaaaaaaaasss.vercel.app/auth/callback
https://aaaaaaaaaasss.vercel.app/**
https://*.vercel.app/**
localhost:3000
http://localhost:3000
```

### Step 4: Test Everything
- Authentication (login/signup)
- Supabase data loading
- All app features

## ⚠️ IMPORTANT
**Update Supabase URLs IMMEDIATELY after deployment** or your app authentication will fail!

## 🔧 Environment Variables Already Set
Your environment variables are already configured in the `.vercel` folder:
- ✅ GEMINI_API_KEY
- ✅ GOOGLE_MAPS_API_KEY  
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY

Just add them to your Vercel dashboard and deploy!