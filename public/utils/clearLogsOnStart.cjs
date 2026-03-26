/**
 * Фейл 5: очистка папки логов при каждом запуске приложения.
 * Иначе логи накапливаются и захламляются. Вызывать в начале whenReady, до запуска сервисов.
 */
const fs = require('fs');

/**
 * Удаляет папку логов приложения (app.getPath('logs')). При следующей записи логгер создаст её заново.
 * @param {import('electron').App} app
 */
function clearLogsOnStart(app) {
  const logsPath = app.getPath('logs');
  try {
    fs.rmSync(logsPath, { recursive: true, force: true });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn('[clearLogsOnStart] Не удалось очистить логи:', err.message);
    }
  }
}

module.exports = { clearLogsOnStart };
