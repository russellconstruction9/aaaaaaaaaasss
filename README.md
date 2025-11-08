<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1gGh1fQv0oHC-VSkIiUiLOlsT00HmWq53

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set up your Supabase database:
   - Follow the instructions in [SUPABASE_SETUP.md](SUPABASE_SETUP.md) to create the required database tables
   - This is **required** for signup/login functionality to work
3. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key (optional, for AI features)
4. Run the app:
   `npm run dev`

## Clean Start

This app now starts with a completely clean slate - no mock users, projects, or inventory data. You'll need to:

1. Sign up or log in with your account
2. Add team members
3. Create projects
4. Set up inventory items

If you need to clear all existing data and start fresh, you can use the `clearAllAppData` utility from `utils/clearData.ts`.
