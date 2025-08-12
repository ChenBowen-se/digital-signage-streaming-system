const { app } = require('electron');
const { start } = require('./schedule-checker');
const { attachAuthHeader } = require('./auth-attach');

let isQuitting = false;

// 阻止应用退出
app.on('window-all-closed', (e) => {
  console.log('🚪 All windows closed, preventing app exit');
  e.preventDefault();
});

// 监听应用即将退出
app.on('before-quit', () => {
  console.log('🚪 App is quitting');
  isQuitting = true;
});

// 监听应用激活
app.on('activate', () => {
  console.log('🚀 App activated');
});

// 监听应用准备就绪
app.whenReady().then(async () => {
  console.log('✅ App is ready, configuring auth headers...');
  await attachAuthHeader();
  console.log('🚀 Starting schedule checker...');
  start();
}).catch((error) => {
  console.error('❌ Failed to start app:', error);
});

// 监听未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});
