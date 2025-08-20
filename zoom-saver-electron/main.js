const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const zoom = require('./utils/zoom');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('zoom-login', async (event) => {
  const token = await zoom.getAccessToken();
  event.sender.send('zoom-token', token);
});

ipcMain.on('download-recordings', async (event, userId, startDate, endDate) => {
  const meetings = await zoom.listRecordings(userId, startDate, endDate);
  event.sender.send('recordings-list', meetings);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
