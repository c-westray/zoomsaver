const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  zoomLogin: () => ipcRenderer.send('zoom-login'),
  downloadRecordings: (userId, startDate, endDate) =>
    ipcRenderer.send('download-recordings', userId, startDate, endDate),
  onToken: (callback) => ipcRenderer.on('zoom-token', (event, token) => callback(token)),
  onRecordings: (callback) => ipcRenderer.on('recordings-list', (event, data) => callback(data))
});
