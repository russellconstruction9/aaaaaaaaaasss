# 🔧 Quick Supabase URL Update Script

## After your Vercel deployment goes live, follow these steps:

### 1. Get Your Live Vercel URL
After deploying, your URL will be something like:
```
https://aaaaaaaaaasss.vercel.app
```
or
```
https://your-custom-name.vercel.app
```

### 2. Copy This Configuration

**Site URL:**
```
https://YOUR_VERCEL_URL_HERE
```

**Additional Redirect URLs (add all of these):**
```
https://YOUR_VERCEL_URL_HERE
https://YOUR_VERCEL_URL_HERE/auth/callback
https://YOUR_VERCEL_URL_HERE/**
https://YOUR_VERCEL_URL_HERE/login
https://YOUR_VERCEL_URL_HERE/signup
https://*.vercel.app
localhost:3000
http://localhost:3000
```

**CORS Origins:**
```
https://YOUR_VERCEL_URL_HERE
https://*.vercel.app
http://localhost:3000
localhost:3000
```

### 3. Update in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/yvzdobyawqcrwwfwkiyf
2. Authentication → Settings → URL Configuration
3. Paste the URLs above (replace YOUR_VERCEL_URL_HERE with actual URL)
4. Save changes

### 4. Test Your Deployment

After updating Supabase:
- Visit your Vercel app
- Test login/signup functionality
- Verify all features work properly

---

**Important**: Do this IMMEDIATELY after deployment to avoid authentication errors!