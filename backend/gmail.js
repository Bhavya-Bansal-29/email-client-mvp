const { google } = require('googleapis');
const db = require('./db');
const { refreshAccessToken } = require('./auth');

// Get user's access token from database
async function getUserAccessToken(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT access_token, refresh_token, token_expiry FROM users WHERE id = ?',
      [userId],
      async (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error('User not found'));

        // Check if token is expired and refresh if needed
        if (row.token_expiry && row.token_expiry < Date.now()) {
          try {
            const newTokens = await refreshAccessToken(row.refresh_token);
            db.run(
              'UPDATE users SET access_token = ?, token_expiry = ? WHERE id = ?',
              [newTokens.access_token, newTokens.expiry_date, userId]
            );
            resolve(newTokens.access_token);
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(row.access_token);
        }
      }
    );
  });
}

// Fetch inbox emails
async function getInboxEmails(userId, maxResults = 20) {
  try {
    const accessToken = await getUserAccessToken(userId);
    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: authClient });

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox',
      maxResults,
    });

    const messages = response.data.messages || [];

    const emailsPromises = messages.map((msg) =>
      gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' })
    );

    const emailsData = await Promise.all(emailsPromises);

    const emails = emailsData.map((data) => {
      const headers = data.data.payload.headers;
      return {
        id: data.data.id,
        from: headers.find((h) => h.name === 'From')?.value || 'Unknown',
        to: headers.find((h) => h.name === 'To')?.value || '',
        subject: headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
        snippet: data.data.snippet,
        date: headers.find((h) => h.name === 'Date')?.value || '',
      };
    });

    return emails;
  } catch (error) {
    console.error('Error fetching inbox:', error);
    throw error;
  }
}

// Fetch sent emails
async function getSentEmails(userId, maxResults = 20) {
  try {
    const accessToken = await getUserAccessToken(userId);
    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: authClient });

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:sent',
      maxResults,
    });

    const messages = response.data.messages || [];

    const emailsPromises = messages.map((msg) =>
      gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' })
    );

    const emailsData = await Promise.all(emailsPromises);

    const emails = emailsData.map((data) => {
      const headers = data.data.payload.headers;
      return {
        id: data.data.id,
        from: headers.find((h) => h.name === 'From')?.value || 'Unknown',
        to: headers.find((h) => h.name === 'To')?.value || '',
        subject: headers.find((h) => h.name === 'Subject')?.value || '(No Subject)',
        snippet: data.data.snippet,
        date: headers.find((h) => h.name === 'Date')?.value || '',
      };
    });

    return emails;
  } catch (error) {
    console.error('Error fetching sent emails:', error);
    throw error;
  }
}

// Send email
async function sendEmail(userId, to, subject, body) {
  try {
    const accessToken = await getUserAccessToken(userId);
    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: authClient });

    const email = [
      `From: me`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      '',
      body,
    ].join('\n');

    const encodedMessage = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = {
  getInboxEmails,
  getSentEmails,
  sendEmail,
};
