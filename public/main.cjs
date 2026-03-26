/**
 * Electron main process — только оркестрация.
 * Вся логика вынесена в public/utils/.
 */
const { app, BrowserWindow } = require('electron');
const { createMainWindow } = require('./utils/createMainWindow.cjs');
const { getJavaPath, getJarPaths, startService, killAllProcesses } = require('./utils/jarServices.cjs');
const { killPortsIfInUse } = require('./utils/killPortsIfInUse.cjs');
const { startWithLoadingFlow } = require('./utils/startWithLoadingFlow.cjs');
const { setupIpcAndShortcuts, unregisterShortcuts } = require('./utils/setupIpcAndShortcuts.cjs');
const { clearLogsOnStart } = require('./utils/clearLogsOnStart.cjs');

let mainWindow = null;
let processCore = null;
let processBpm = null;
let processContext = null;

app.whenReady().then(async () => {
  clearLogsOnStart(app);
  setupIpcAndShortcuts(app);
  await killPortsIfInUse();
  const javaPath = getJavaPath(app);
  const paths = getJarPaths(app);
  processCore = startService('brok-core', paths.core, javaPath);
  processBpm = startService('brok-bpm', paths.bpm, javaPath);
  processContext = startService('brok-context', paths.context, javaPath);

  startWithLoadingFlow(__dirname, { onMainWindowReady: (win) => { mainWindow = win; } });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow(__dirname);
    }
  });
});

app.on('will-quit', () => {
  unregisterShortcuts();
  killAllProcesses([processCore, processBpm, processContext]);
});

app.on('window-all-closed', () => {
  app.quit();
});
