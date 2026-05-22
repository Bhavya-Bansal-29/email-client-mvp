# 🚀 Quick Start Guide

## Local Development

### Backend (Terminal 1)
```bash
cd backend
npm install  # (if not done)
npm start
```
Backend runs on: `http://localhost:5000`

### Expose to Internet (Terminal 2)
```bash
# Download ngrok from: https://ngrok.com/download
# Then run:
./ngrok http 5000
```
You'll get a URL like: `https://abc123-xyz789.ngrok-free.dev`

### Frontend (Terminal 3)
```bash
cd frontend
npm install  # (if not done)
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## Production Deployment

### Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com)
2. Connect your GitHub account
3. Import this repository
4. Set **Root Directory**: `./frontend`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-ngrok-url.ngrok-free.dev
   ```
6. Deploy! ✅

### Backend (Local Machine)
Keep running on your laptop with ngrok tunnel

### Google Cloud OAuth
Update redirect URIs to include your ngrok URL:
- `https://your-ngrok-url.ngrok-free.dev/auth/callback`

---

## Environment Variables

### Backend (.env)
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/callback
PORT=5000
FRONTEND_URL=http://localhost:5173  (or your Vercel URL)
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000  (or your ngrok/deployed URL)
```

---

## Features
✅ Gmail OAuth Login
✅ View Inbox Emails
✅ View Sent Emails
✅ Compose & Send Emails
✅ Email Caching
✅ Beautiful UI with Tailwind CSS

---

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Gmail API
- **Database**: SQLite (local) / PostgreSQL (production)
- **Caching**: Node-cache
- **Auth**: OAuth 2.0

---

## Troubleshooting

### "Connection refused" on frontend
- Make sure backend is running
- Check VITE_API_URL is correct

### "OAuth redirect failed"
- Update Google Cloud redirect URIs
- Check FRONTEND_URL in backend .env

### ngrok URL keeps changing
- Free tier gets new URL on restart
- Update VITE_API_URL in Vercel each time
- (Consider paid ngrok or Railway for stability)

---

Enjoy! 🎉
