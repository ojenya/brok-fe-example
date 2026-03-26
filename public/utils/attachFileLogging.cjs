/**
 * Хотелка 3: запись stdout/stderr и exit каждого сервиса в лог-файлы.
 */
const { getLogger } = require('./getLogger.cjs');

/**
 * Подписывается на stdout, stderr и exit процесса и пишет в файлы в app.getPath('logs').
 * @param {import('child_process').ChildProcess | null} proc — процесс сервиса
 * @param {string} serviceName — имя сервиса (brok-core, brok-bpm, brok-context)
 */
function attachFileLogging(proc, serviceName) {
  if (!proc) return;
  const log = getLogger(`${serviceName}-out`, `${serviceName}.log`);
  const errLog = getLogger(`${serviceName}-err`, `${serviceName}-error.log`);
  const exitLog = getLogger('app-exit', 'app-exit.log');

  log.info(`[${serviceName}] Запуск...`);
  proc.stdout?.on('data', (d) => log.info(d.toString().trim()));
  proc.stderr?.on('data', (d) => errLog.info(d.toString().trim()));
  proc.on('exit', (code, signal) => {
    exitLog.info(`${serviceName} exited: code=${code}, signal=${signal}`);
  });
}

module.exports = { attachFileLogging };
