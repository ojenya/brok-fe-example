/**
 * Хотелка 6: IPC-обработчики (открытие папки логов, версия приложения) и глобальный шорткат.
 * Регистрация в whenReady, снятие шорткатов в will-quit.
 */
const { ipcMain, shell, dialog, globalShortcut } = require('electron');

/**
 * Регистрирует IPC-обработчики и глобальный шорткат Ctrl/Cmd+Shift+L (открытие папки логов).
 * @param {import('electron').App} app
 */
function setupIpcAndShortcuts(app) {
  const logsPath = app.getPath('logs');

  ipcMain.handle('open-logs-folder', async () => {
    try {
      await shell.openPath(logsPath);
    } catch (err) {
      console.error('Ошибка при открытии папки с логами:', err);
      dialog.showErrorBox('Ошибка', `Не удалось открыть папку с логами: ${err.message}`);
      throw err;
    }
  });

  ipcMain.handle('get-app-version', () => app.getVersion());

  globalShortcut.register('CommandOrControl+Shift+L', () => {
    shell.openPath(logsPath).catch((err) => {
      console.error('Ошибка при открытии папки с логами (шорткат):', err);
      dialog.showErrorBox('Ошибка', `Не удалось открыть папку с логами: ${err.message}`);
    });
  });
}

function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}

module.exports = { setupIpcAndShortcuts, unregisterShortcuts };
