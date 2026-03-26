/**
 * При старте приложения освобождает порты 21815–21817, если они заняты
 * (например, после падения приложения процессы могли остаться висеть).
 */
const kill = require('kill-port');

const PORTS = [21815, 21816, 21817];

/**
 * Завершает процессы, слушающие на указанных портах. Без ошибок, если порт свободен.
 * @param {number[]} [ports] — порты (по умолчанию 21815, 21816, 21817)
 * @returns {Promise<void>}
 */
async function killPortsIfInUse(ports = PORTS) {
  for (const port of ports) {
    try {
      await kill(port, 'tcp');
    } catch (_) {
      // Порт свободен или процесс уже завершён — игнорируем
    }
  }
}

module.exports = { killPortsIfInUse, PORTS };
