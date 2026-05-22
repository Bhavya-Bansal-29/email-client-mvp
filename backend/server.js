require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getAuthUrl, handleOAuthCallback } = require('./auth');
const { getInboxEmails, getSentEmails, sendEmail } = require('./gmail');
const db = require('./db');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Additional CORS headers for ngrok
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes

// 1. Login endpoint - returns Google OAuth URL
app.get('/auth/login', (req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. OAuth Callback - handles Google redirect
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    const { userId, email, tokens } = await handleOAuthCallback(code);

    // Create session
    const sessionId = require('crypto').randomBytes(16).toString('hex');
    db.run(
      'INSERT INTO sessions (session_id, user_id) VALUES (?, ?)',
      [sessionId, userId]
    );

    // Redirect to frontend with session
    const redirectUrl = `${process.env.FRONTEND_URL}?sessionId=${sessionId}&userId=${userId}&email=${encodeURIComponent(email)}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  }
});

// 3. Get Inbox
app.get('/api/inbox', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  try {
    const emails = await getInboxEmails(userId);
    res.json({ emails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get Sent Emails
app.get('/api/sent', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  try {
    const emails = await getSentEmails(userId);
    res.json({ emails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Send Email
app.post('/api/send', async (req, res) => {
  const { userId, to, subject, body } = req.body;

  if (!userId || !to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await sendEmail(userId, to, subject, body);
    res.json({ success: true, messageId: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Get User Info
app.get('/api/user', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  db.get('SELECT email FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });

    res.json({ email: row.email });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
