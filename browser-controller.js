const { BrowserWindow } = require('electron');

let win = null;

function openPlayer(url, durationInSeconds, onClose) {
  if (win) {
    win.close();
    win = null;
  }

  win = new BrowserWindow({
    fullscreen: true,
    webPreferences: { nodeIntegration: false }
  });
  console.log(`🔗 Opening URL: ${url}`);

  win.loadURL(url);

  setTimeout(() => {
    if (win) {
      win.close();
      win = null;
      if (onClose) onClose();
    }
  }, durationInSeconds * 1000);
}

module.exports = openPlayer;