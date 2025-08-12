const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'agent-config.json'), 'utf-8'));
let accessToken = null;

function expired(tk) {
  try {
    const { exp } = jwt.decode(tk) || {};
    return !exp || (Date.now()/1000 >= exp - 30); // 提前30秒刷新
  } catch { return true; }
}

async function getToken() {
  if (accessToken && !expired(accessToken)) return accessToken;
  
  try {
    console.log('🔐 Getting new access token...');
    const res = await axios.post(`${config.backendUrl}/api/auth/login`, {
      username: config.credentials.username,
      password: config.credentials.password
    });
    
    accessToken = res.data.accessToken || res.data.token;
    console.log('✅ Token obtained successfully');
    return accessToken;
  } catch (error) {
    console.error('❌ Failed to get token:', error.message);
    throw error;
  }
}

module.exports = { getToken, config };
