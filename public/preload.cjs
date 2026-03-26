/**
 * Preload — IPC bridge. Экспонирует только разрешённые каналы (хотелка 4: прогресс сервисов).
 * Имена каналов захардкожены, чтобы preload не падал из-за require() при loadFile (разный cwd).
 */
const { contextBridge, ipcRenderer } = require('electron');

const progressChannels = ['progressCore', 'progressBpm', 'progressContext'];

contextBridge.exposeInMainWorld('electronAPI', {
  openLogsFolder: () => ipcRenderer.invoke('open-logs-folder'),
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  on(channel, callback) {
    if (progressChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
  },
});
