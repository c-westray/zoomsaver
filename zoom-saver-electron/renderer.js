const loginBtn = document.getElementById('login');
const downloadBtn = document.getElementById('download');
const status = document.getElementById('status');

loginBtn.addEventListener('click', () => {
  window.electronAPI.zoomLogin();
});

downloadBtn.addEventListener('click', () => {
  const userId = prompt('Enter Zoom user ID:');
  const startDate = prompt('Start date (YYYY-MM-DD):');
  const endDate = prompt('End date (YYYY-MM-DD):');
  window.electronAPI.downloadRecordings(userId, startDate, endDate);
});

window.electronAPI.onToken((token) => {
  status.innerText = 'Zoom OAuth token received!';
});

window.electronAPI.onRecordings((data) => {
  status.innerText = `Found ${data.length} recordings.`;
});
