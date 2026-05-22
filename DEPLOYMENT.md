# 🚀 Email Client MVP - Deployment Guide

Complete guide to deploy your email client for free using Railway (Backend) and Vercel (Frontend).

---

## **Step 1: Create GitHub Repository**

1. Initialize Git locally:
```bash
cd "D:\Projects\Email Client"
git init
git add .
git commit -m "Initial commit: Email client MVP"
```

2. Create repository on [GitHub.com](https://github.com)
   - Name: `email-client-mvp`
   - Make it **PUBLIC**

3. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/email-client-mvp.git
git branch -M main
git push -u origin main
```

---

## **Step 2: Deploy Backend on Railway.app**

### 2.1 Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Deploy Backend
1. Click **"New Project"**
2. Select **"Deploy from GitHub"**
3. Find and select **`email-client-mvp`** repository
4. Railway will auto-detect Node.js
5. Wait for deployment (~2-3 minutes)

### 2.3 Add PostgreSQL Database
1. In Railway dashboard, click **"Add"**
2. Select **"PostgreSQL"**
3. Railway auto-adds DATABASE_URL environment variable

### 2.4 Configure Environment Variables
In Railway dashboard:
1. Go to your project → Backend service
2. Click **"Variables"**
3. Add these variables:

```
GOOGLE_CLIENT_ID=223584035260-r6l8r20q4qbd59eol7jh7vt7aompf13f.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_secret_here
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://YOUR_VERCEL_DOMAIN  (fill after deploying frontend)
DATABASE_URL=(Railway auto-adds this)
```

### 2.5 Get Backend URL
1. In Railway dashboard, find your backend service
2. Copy the **Domain** URL (looks like: `https://email-client-prod.railway.app`)
3. Save this - you'll need it for frontend

---

## **Step 3: Deploy Frontend on Vercel**

### 3.1 Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 3.2 Deploy Frontend
1. Click **"Add New Project"**
2. Select **`email-client-mvp`** repository
3. Select **Framework: Vite**
4. In **"Root Directory"**, select `./frontend`
5. Click **"Deploy"**

### 3.3 Configure Frontend Environment
1. After deployment, go to **Project Settings**
2. Click **"Environment Variables"**
3. Add this variable:

```
VITE_API_URL=https://your-railway-backend-url.railway.app
```

**Example:**
```
VITE_API_URL=https://email-client-prod.railway.app
```

4. **Redeploy** to apply variables

### 3.4 Get Frontend URL
Copy your Vercel domain (looks like: `https://email-client-mvp.vercel.app`)

---

## **Step 4: Update Google Cloud OAuth**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select **EmailClientMVP** project
3. Go to **APIs & Services** → **Credentials**
4. Click your **OAuth 2.0 Client ID**
5. Update:

**Authorized JavaScript origins:**
- `http://localhost:3000` (local dev - keep)
- `https://your-vercel-domain.vercel.app` (production)

**Authorized redirect URIs:**
- `http://localhost:5000/auth/callback` (local dev - keep)
- `https://your-railway-backend-url.railway.app/auth/callback` (production)

6. Click **Save**

---

## **Step 5: Update Backend with Frontend URL**

1. Go to Railway dashboard → Your backend service
2. Click **"Variables"**
3. Update **FRONTEND_URL** with your Vercel domain:
   ```
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   ```
4. Railway auto-redeploys

---

## **Step 6: Update Frontend with Backend URL**

1. Go to Vercel dashboard → Your project
2. Click **"Settings"** → **"Environment Variables"**
3. Update **VITE_API_URL**:
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app
   ```
4. Click **"Save and Deploy"**

---

## **Step 7: Test Live Deployment**

1. Open your Vercel URL in browser
2. Click **"Sign in with Gmail"**
3. Should redirect to Google OAuth
4. After auth, you're logged in!
5. Test:
   - ✅ Inbox - View emails
   - ✅ Sent - View sent emails
   - ✅ Compose - Send test email

---

## **🎉 Share with Client**

Your deployed URL: **`https://your-vercel-domain.vercel.app`**

Client can:
- ✅ Visit without installation
- ✅ Sign in with Gmail
- ✅ Full email access
- ✅ Send/receive emails

---

## **📋 Checklist**

- [ ] GitHub repository created
- [ ] Backend deployed on Railway
- [ ] PostgreSQL database added to Railway
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set in Railway
- [ ] Environment variables set in Vercel
- [ ] Google Cloud OAuth updated
- [ ] Tested login flow
- [ ] Tested inbox feature
- [ ] Tested sent feature
- [ ] Tested compose feature
- [ ] Shared URL with client

---

## **⚠️ Troubleshooting**

### Frontend shows "Failed to connect"
- Check VITE_API_URL is correct in Vercel
- Make sure Railway backend is running
- Check CORS settings in backend

### OAuth redirect fails
- Verify redirect URIs in Google Cloud
- Check FRONTEND_URL in Railway variables
- Check GOOGLE_CLIENT_SECRET is correct

### PostgreSQL not working
- Verify DATABASE_URL exists in Railway
- Check NODE_ENV=production

### Email list empty
- Grant Gmail API permissions
- Verify access_token is valid
- Check database connection

---

## **Free Tier Limits**

**Railway**: $5/month free credit (plenty for MVP)
**Vercel**: Unlimited free deployments
**PostgreSQL**: Free tier on Railway

Your costs: **$0** 🎉
