/**
 * Создание главного окна приложения (loadURL dev или loadFile dist).
 */
const { BrowserWindow } = require('electron');
const path = require('path');

/**
 * @param {string} dirname — __dirname из main (public/)
 * @param {{ show?: boolean }} options — show: false чтобы показать по ready-to-show (splash flow)
 * @returns {import('electron').BrowserWindow}
 */
function createMainWindow(dirname, options = {}) {
  const { show = true } = options;
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    minHeight: 720,
    height: 720,
    title: 'BrOk',
    show,
    webPreferences: {
      sandbox: true,
      preload: path.join(dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });


    const devUrl = process.env.ELECTRON_VITE_DEV_URL;
    if (devUrl) {
      win.loadURL(devUrl);
    } else {
      win.loadFile(path.join(dirname, '..', 'dist', 'index.html'));
    }

    win.on('closed', () => { /* окно уже закрыто */ });
    return win;
  }

  module.exports = { createMainWindow };
