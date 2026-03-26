/**
 * Запуск и остановка JAR-сервисов (хотелки 1, 2). Фейл 3: запуск через встроенную JRE (brok-jre).
 */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { attachFileLogging } = require('./attachFileLogging.cjs');

/**
 * Путь к исполняемому файлу Java: встроенная brok-jre в jars/ или системная 'java'.
 * @param {import('electron').App} app
 * @returns {string}
 */
function getJavaPath(app) {
  const resourcesPath = !app.isPackaged ? app.getAppPath() : process.resourcesPath;
  const jarsDir = path.join(resourcesPath, 'jars');
  const jreBin = path.join(jarsDir, 'brok-jre', 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
  if (fs.existsSync(jreBin)) return jreBin;
  return 'java';
}

/**
 * Возвращает пути к трём JAR в папке jars (dev — корень проекта, prod — resources/jars).
 * @param {import('electron').App} app
 * @returns {{ core: string, bpm: string, context: string }}
 */
function getJarPaths(app) {
  const resourcesPath = !app.isPackaged ? app.getAppPath() : process.resourcesPath;
  const jarsDir = path.join(resourcesPath, 'jars');
  return {
    core: path.join(jarsDir, 'brok-core.jar'),
    bpm: path.join(jarsDir, 'brok-bpm.jar'),
    context: path.join(jarsDir, 'brok-context.jar'),
  };
}

/**
 * Запускает один JAR-сервис: spawn(javaPath, ['-jar', jarPath]) + логирование. Если JAR нет — null.
 * @param {string} name — brok-core, brok-bpm, brok-context
 * @param {string} jarPath
 * @param {string} javaPath — путь к java (getJavaPath(app) или 'java')
 * @returns {import('child_process').ChildProcess | null}
 */
function startService(name, jarPath, javaPath) {
  if (!fs.existsSync(jarPath)) {
    console.warn(`[${name}] JAR не найден: ${jarPath}. Запуск без сервиса (демо).`);
    return null;
  }
  const proc = spawn(javaPath, ['-jar', jarPath], { stdio: ['ignore', 'pipe', 'pipe'] });
  attachFileLogging(proc, name);
  return proc;
}

/**
 * Завершает все переданные процессы через tree-kill (хотелка 2).
 * @param {(import('child_process').ChildProcess | null)[]} processes
 */
function killAllProcesses(processes) {
  const kill = require('tree-kill');
  processes.forEach((proc) => {
    if (proc && proc.pid) kill(proc.pid, (err) => { if (err) console.error('kill error', err); });
  });
}

module.exports = { getJavaPath, getJarPaths, startService, killAllProcesses };
