const { google } = require('googleapis');
const fs = require('fs');
const envConfig = fs.readFileSync('.env.local', 'utf8').split('\n');
for (const line of envConfig) {
  if (line.includes('=')) {
    const [key, ...value] = line.split('=');
    process.env[key.trim()] = value.join('=').trim().replace(/^"|"$/g, '');
  }
}

const credentials = {
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/calendar.events'],
});

const calendar = google.calendar({ version: 'v3', auth });

calendar.events.insert({
  calendarId: 'mrjohnsbarbier@gmail.com',
  sendUpdates: 'all',
  requestBody: {
    summary: 'Test Event from Node',
    start: { dateTime: '2026-05-20T10:00:00', timeZone: 'America/Costa_Rica' },
    end: { dateTime: '2026-05-20T10:30:00', timeZone: 'America/Costa_Rica' },
    attendees: [{ email: 'cesarmadrod241997@gmail.com' }] // Assume valid email
  }
}).then(res => {
  console.log('Success:', res.data.id);
}).catch(err => {
  console.error('API Error:', err.message);
  console.error(err.errors);
});
