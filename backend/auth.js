const { google } = require('googleapis');
const crypto = require('crypto');
const db = require('./db');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate authorization URL
function getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
}

// Handle OAuth callback
async function handleOAuthCallback(code) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });

    const userId = 'user_' + crypto.randomBytes(8).toString('hex');
    const email = profile.data.emailAddress;

    // Store in database
    db.run(
      `INSERT OR REPLACE INTO users (id, email, refresh_token, access_token, token_expiry)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, email, tokens.refresh_token, tokens.access_token, tokens.expiry_date],
      (err) => {
        if (err) console.error('DB error:', err);
      }
    );

    return { userId, email, tokens };
  } catch (error) {
    console.error('OAuth error:', error);
    throw error;
  }
}

// Refresh access token if needed
async function refreshAccessToken(refreshToken) {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}

module.exports = {
  oauth2Client,
  getAuthUrl,
  handleOAuthCallback,
  refreshAccessToken,
};
