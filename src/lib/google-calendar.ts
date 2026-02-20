import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const credentialsPath = join(process.cwd(), 'google-oauth-client.json');
const tokenPath = join(process.cwd(), 'google-oauth-tokens.json');

const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8')).web;

const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  'http://localhost:3000/api/auth/google-calendar/callback' // Redirect URI
);

// Load tokens if they exist
if (existsSync(tokenPath)) {
  const tokens = JSON.parse(readFileSync(tokenPath, 'utf8'));
  oauth2Client.setCredentials(tokens);
}

// Function to get authorization URL
export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
}

// Function to set tokens
export function setTokens(tokens: any) {
  oauth2Client.setCredentials(tokens);
  writeFileSync(tokenPath, JSON.stringify(tokens));
}

// Function to refresh tokens if needed
export async function refreshTokensIfNeeded() {
  if (oauth2Client.credentials.expiry_date && Date.now() > oauth2Client.credentials.expiry_date) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      setTokens(credentials);
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw error;
    }
  }
}

// Function to check if authorized
export function isAuthorized() {
  return oauth2Client.credentials && oauth2Client.credentials.access_token;
}

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export { calendar, oauth2Client };