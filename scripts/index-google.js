const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Path to Google Service Account Credentials
const CREDENTIALS_PATH = path.join(
  __dirname,
  '..',
  'apps',
  'docs',
  'app',
  'api',
  'gen-lang-client-0971748290-c41b40cca346.json'
);

function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateJwt(clientEmail, privateKey) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedClaimSet = base64url(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(privateKey);
  const encodedSignature = base64url(signature);

  return `${signatureInput}.${encodedSignature}`;
}

async function getAccessToken(clientEmail, privateKey) {
  const jwt = generateJwt(clientEmail, privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`OAuth Authentication Error: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function sendUrlToGoogleIndexing(url, accessToken, type = 'URL_UPDATED') {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url,
      type
    })
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  const targetUrls = process.argv.slice(2);
  
  if (targetUrls.length === 0) {
    targetUrls.push('https://nexoreui.vercel.app/nexoremake');
  }

  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`[ERROR] Credentials file not found at: ${CREDENTIALS_PATH}`);
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  console.log(`[INFO] Service account: ${credentials.client_email}`);

  console.log(`[INFO] Requesting OAuth access token...`);
  const accessToken = await getAccessToken(credentials.client_email, credentials.private_key);
  console.log(`[INFO] Access token successfully acquired!`);

  for (const url of targetUrls) {
    console.log(`\n[SENDING] ${url}...`);
    try {
      const result = await sendUrlToGoogleIndexing(url, accessToken);
      if (result.status === 200) {
        console.log(`[SUCCESS] Google Indexing API response:`);
        console.log(JSON.stringify(result.data, null, 2));
      } else {
        console.error(`[FAILURE] HTTP Status ${result.status}:`);
        console.error(JSON.stringify(result.data, null, 2));
      }
    } catch (err) {
      console.error(`[ERROR] Failed to send ${url}:`, err.message);
    }
  }
}

main();
