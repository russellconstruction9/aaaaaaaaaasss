# 🔗 Supabase + Vercel URL Configuration

## 🎯 What You Need to Do

After your Vercel deployment is live, you need to update your Supabase project settings to allow your Vercel URL.

## 📋 Step-by-Step Instructions

### 1. **Get Your Vercel Deployment URL**
After deploying to Vercel, you'll get URLs like:
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: `https://your-project-name-git-main-username.vercel.app`

### 2. **Update Supabase Authentication Settings**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `yvzdobyawqcrwwfwkiyf`

2. **Navigate to Authentication Settings**
   - Click: Authentication → Settings → URL Configuration

3. **Add Vercel URLs to Site URL**
   ```
   Site URL: https://your-project-name.vercel.app
   ```

4. **Add Vercel URLs to Redirect URLs**
   Add these URLs to the "Additional Redirect URLs" section:
   ```
   https://your-project-name.vercel.app
   https://your-project-name.vercel.app/auth/callback
   https://your-project-name.vercel.app/**
   https://your-project-name-git-main-username.vercel.app
   https://your-project-name-git-main-username.vercel.app/**
   ```

### 3. **Update CORS Settings (if needed)**

1. **Go to Settings → API**
2. **Update CORS origins** to include:
   ```
   https://your-project-name.vercel.app
   https://*.vercel.app
   ```

## 🔧 Automatic Configuration Script

Once you have your Vercel URL, replace `YOUR_VERCEL_URL` below and run this in your Supabase SQL editor:

```sql
-- Update RLS policies if you have any that check origins
-- This is optional depending on your setup

-- Example: If you have row-level security that checks domains
-- UPDATE your_table SET allowed_domains = array_append(allowed_domains, 'https://your-project-name.vercel.app');
```

## 📝 Configuration Checklist

After deployment, update these in Supabase Dashboard:

- [ ] **Site URL**: Set to your production Vercel URL
- [ ] **Additional Redirect URLs**: Add Vercel URLs with wildcards
- [ ] **CORS Origins**: Add Vercel domain pattern
- [ ] **Test Authentication**: Verify login/signup works on live site

## 🚀 Common Vercel URL Patterns

Your URLs will typically be:
- **Production**: `https://[project-name].vercel.app`
- **Git Branch**: `https://[project-name]-git-[branch]-[username].vercel.app`
- **Deployment**: `https://[project-name]-[deployment-id].vercel.app`

## ⚠️ Important Notes

1. **Add URLs BEFORE testing** - Authentication will fail without proper configuration
2. **Use wildcards** for branch deployments: `https://your-project-*.vercel.app`
3. **Include both HTTP and HTTPS** if testing locally
4. **Update immediately after deployment** to avoid authentication errors

## 🔄 After Each New Domain

Whenever you:
- Deploy to a new domain
- Change your Vercel project name
- Use custom domains

Remember to update the Supabase URL configuration accordingly.

---

**Next Step**: Deploy to Vercel first, get your URL, then update Supabase with the actual deployment URL!