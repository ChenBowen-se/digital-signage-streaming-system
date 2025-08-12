const { session } = require('electron');
const { getToken, config } = require('./auth');

async function attachAuthHeader() {
  const s = session.defaultSession;
  
  s.webRequest.onBeforeSendHeaders(async (details, callback) => {
    if (details.url.startsWith(config.backendUrl)) {
      try {
        const token = await getToken();
        details.requestHeaders.Authorization = `Bearer ${token}`;
        console.log('🔑 Added Authorization header for:', details.url);
      } catch (error) {
        console.error('❌ Failed to add auth header:', error.message);
      }
    }
    callback({ requestHeaders: details.requestHeaders });
  });
  
  console.log('✅ Auth header attachment configured');
}

module.exports = { attachAuthHeader };
