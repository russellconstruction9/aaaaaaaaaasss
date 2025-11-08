# 🔑 API Keys Setup Guide
# Follow these steps to get your API keys

## 1. 🤖 GET GEMINI API KEY

### Steps:
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the generated key
5. Paste it below:

GEMINI_API_KEY=PASTE_YOUR_GEMINI_KEY_HERE

---

## 2. 🗺️ GET GOOGLE MAPS API KEY

### Steps:
1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable "Maps JavaScript API"
4. Go to Credentials > Create Credentials > API Key
5. Copy the generated key
6. Paste it below:

GOOGLE_MAPS_API_KEY=PASTE_YOUR_MAPS_KEY_HERE

---

## 3. 🗄️ GET SUPABASE CREDENTIALS

### Steps:
1. Go to: https://supabase.com/dashboard
2. Create a new project or select existing one
3. Go to Settings > API
4. Copy the Project URL and anon public key
5. Paste them below:

VITE_SUPABASE_URL=PASTE_YOUR_SUPABASE_URL_HERE
VITE_SUPABASE_ANON_KEY=PASTE_YOUR_SUPABASE_ANON_KEY_HERE

---

## 4. ✅ AFTER GETTING ALL KEYS

1. Fill in all the values above
2. Copy each key to Vercel Dashboard:
   - Go to your project on vercel.com
   - Settings > Environment Variables
   - Add each variable
   - Set for Production, Preview, Development

## 5. 🚀 DEPLOY

Once all keys are set in Vercel:
```bash
vercel --prod
```

---

## ⚠️ SECURITY REMINDER
- Never share these keys publicly
- Don't commit them to Git
- Keep them secure and private