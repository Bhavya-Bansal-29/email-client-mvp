# 📋 Deploy to Vercel in 3 Steps

## Step 1: Go to Vercel
- Visit https://vercel.com
- Click **"Sign Up"** → **"Continue with GitHub"**
- Authorize Vercel to access your GitHub account

## Step 2: Import Your Repository
1. After signing in, click **"Add New..."** → **"Project"**
2. Find **`email-client-mvp`** in your repositories
3. Click **"Import"**

## Step 3: Configure Project
1. **Framework**: Vite (auto-detected)
2. **Root Directory**: `./frontend`
3. **Environment Variables**: 
   - Name: `VITE_API_URL`
   - Value: `https://shawn-unnational-compliably.ngrok-free.dev` (your ngrok URL)
4. Click **"Deploy"** ✅

---

## Done! 🎉

Your frontend will be live at a URL like:
```
https://email-client-mvp.vercel.app
```

Share this with your client!

---

## Important

Every time your ngrok URL changes:
1. Get new ngrok URL from Terminal 2
2. Go to Vercel → **Settings** → **Environment Variables**
3. Update `VITE_API_URL`
4. Redeploy

Or... you can use a paid ngrok plan ($5/month) to keep the same URL forever!
