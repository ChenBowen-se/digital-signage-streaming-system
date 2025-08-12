const axios = require('axios');
const fs = require('fs');
const path = require('path');
const openPlayer = require('./browser-controller');

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'agent-config.json'), 'utf-8')
);

let playingSchedule = null;

async function checkSchedule() {
  try {
    const res = await axios.get(`${config.backendUrl}/api/schedules/play-command`, {
      params: { panelId: config.panelId }
    });

    const data = res.data;
    if (data.code === 200 && data.data) {
      const { scheduleId, duration } = data.data;

      // 如果当前 schedule 已在播放，则跳过
      if (playingSchedule === scheduleId) return;

      console.log(`Playing schedule ${scheduleId} for ${duration}s`);
      playingSchedule = scheduleId;

      const url = new URL(config.playerBaseUrl);
      url.searchParams.set("scheduleId", scheduleId.toString());

      openPlayer(url.toString(), duration, () => {
        playingSchedule = null;
      });
    }
  } catch (err) {
    console.error('Schedule check failed:', err.message);
  }
}

function start() {
  setInterval(checkSchedule, config.pollingInterval);
}

module.exports = { start };