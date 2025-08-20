require('dotenv').config();
const axios = require('axios');

async function getAccessToken() {
  const res = await axios.post('https://zoom.us/oauth/token', null, {
    params: { grant_type: 'client_credentials' },
    auth: {
      username: process.env.ZOOM_CLIENT_ID,
      password: process.env.ZOOM_CLIENT_SECRET
    }
  });
  return res.data.access_token;
}

async function listRecordings(userId, startDate, endDate) {
  const token = await getAccessToken();
  const res = await axios.get(`https://api.zoom.us/v2/users/${userId}/recordings`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { from: startDate, to: endDate }
  });
  return res.data.meetings;
}

module.exports = { getAccessToken, listRecordings };
