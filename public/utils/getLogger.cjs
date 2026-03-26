/**
 * Хотелка 3: логгер для записи stdout/stderr Java-сервисов в файлы.
 * Файлы сохраняются в стандартной папке логов Electron (app.getPath('logs')).
 */
const log = require('electron-log/main');
const path = require('path');
const { app } = require('electron');

log.initialize();

/**
 * Создаёт логгер с записью в файл в папке логов приложения.
 * @param {string} logId — уникальный идентификатор логгера
 * @param {string} logPath — имя файла (например 'brok-core.log')
 * @returns {import('electron-log').ElectronLog}
 */
function getLogger(logId, logPath) {
  const logger = log.create({ logId });
  logger.transports.file.resolvePathFn = () =>
    path.join(app.getPath('logs'), logPath);
  return logger;
}

module.exports = { getLogger };
