/**
 * Оркестрация: окно загрузки → health-check по трём сервисам → главное окно (хотелка 4).
 * Порядок как в рабочей версии: сначала подписка на LOADING_EVENTS (setupServiceReadinessCheck), затем старт fetchWithRetry.
 */
const { SERVICE_CONFIG } = require('./serviceConfig.cjs');
const { fetchWithRetry } = require('./fetchWithRetry.cjs');
const { setupServiceReadinessCheck } = require('./setupServiceReadinessCheck.cjs');
const { createLoadingWindow } = require('./createLoadingWindow.cjs');
const { createMainWindow } = require('./createMainWindow.cjs');

/**
 * @param {string} dirname — __dirname из main
 * @param {{ onMainWindowReady?: (win: import('electron').BrowserWindow) => void }} options
 * @returns {import('electron').BrowserWindow} loadingWindow
 */
function startWithLoadingFlow(dirname, options = {}) {
  const { onMainWindowReady } = options;
  const loadingWindow = createLoadingWindow(dirname);

  const onAllReadyCallback = () => {
    const mainWindow = createMainWindow(dirname, { show: false });
    if (onMainWindowReady) onMainWindowReady(mainWindow);
    mainWindow.once('ready-to-show', () => {
      if (mainWindow) mainWindow.show();
      if (loadingWindow && !loadingWindow.isDestroyed()) loadingWindow.close();
    });
  };

  loadingWindow.webContents.once('did-finish-load', () => {
    setupServiceReadinessCheck(loadingWindow, onAllReadyCallback);
    Object.values(SERVICE_CONFIG).forEach((config) => {
      fetchWithRetry(config.url, {
        progressEvent: config.progressEvent,
        finishedEvent: config.finishedEvent,
      });
    });
  });

  return loadingWindow;
}

module.exports = { startWithLoadingFlow };
