/**
 * Настройка проверки готовности сервисов (как в рабочей версии).
 * Подписываемся на LOADING_EVENTS до старта fetchWithRetry: по прогрессу — отправка в окно, по finished — setReady.
 */
const { LOADING_EVENTS, SERVICE_CONFIG } = require('./serviceConfig.cjs');
const { setReady, onAllReady } = require('./serviceReadinessManager.cjs');

/**
 * @param {import('electron').BrowserWindow} window — окно загрузки
 * @param {() => void} onAllReadyCallback — вызывается, когда все сервисы готовы
 */
function setupServiceReadinessCheck(window, onAllReadyCallback) {
  onAllReady(onAllReadyCallback);

  Object.values(SERVICE_CONFIG).forEach((config) => {
    const progressHandler = (status) => {
      if (window && !window.isDestroyed()) {
        window.webContents.send(config.progressEvent, status);
      }
    };
    const finishedHandler = () => setReady(config.serviceName);

    LOADING_EVENTS.on(config.progressEvent, progressHandler);
    LOADING_EVENTS.on(config.finishedEvent, finishedHandler);
  });
}

module.exports = { setupServiceReadinessCheck };
