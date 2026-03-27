/**
 * Окно загрузки (splash) с индикацией готовности сервисов.
 */
const { BrowserWindow } = require('electron');
const path = require('path');

/**
 * @param {string} dirname — __dirname из main (public/)
 * @returns {import('electron').BrowserWindow}
 */
function createLoadingWindow(dirname) {
  const win = new BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    frame: true,
    webPreferences: {
      preload: path.join(dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  win.loadFile(path.join(dirname, 'loading.html'));
  win.once('ready-to-show', () => win.show());
  win.on('closed', () => {});
  return win;
}

module.exports = { createLoadingWindow };
