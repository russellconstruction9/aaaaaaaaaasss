# Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo-name)

## Manual Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

## Environment Variables Setup

In your Vercel dashboard, add these environment variables:

| Variable Name | Description | Required |
|---------------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini AI API key | ✅ |
| `GOOGLE_MAPS_API_KEY` | Your Google Maps API key | ✅ |
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |

### Setting Environment Variables

1. Go to your project dashboard on [Vercel](https://vercel.com)
2. Navigate to Settings → Environment Variables
3. Add each variable with its corresponding value
4. Make sure to set them for Production, Preview, and Development environments

## Build Settings

Vercel will automatically detect these settings from `vercel.json`:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Local Development

1. Copy environment variables:
```bash
cp .env.example .env.local
```

2. Fill in your actual API keys in `.env.local`

3. Install dependencies:
```bash
npm install
```

4. Run development server:
```bash
npm run dev
```

## Production Build Testing

Test your production build locally:

```bash
npm run build
npm run preview
```

## Troubleshooting

### Build Failures
- Check that all environment variables are set correctly
- Ensure Node.js version is 18 or higher
- Verify all dependencies are properly installed

### Runtime Errors
- Check browser console for errors
- Verify API keys are working
- Ensure Supabase configuration is correct

### Performance Issues
- The build is optimized with code splitting
- Large chunks are separated into vendor bundles
- Source maps are disabled in production

## Support

For deployment issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)