/**
 * Отслеживание готовности трёх сервисов; вызов callback, когда все готовы (хотелка 4).
 */
const SERVICE_NAMES = ['core', 'bpm', 'context'];

const state = { core: false, bpm: false, context: false };
let onAllReadyCallback = null;

function setReady(serviceName) {
  if (SERVICE_NAMES.includes(serviceName)) state[serviceName] = true;
  if (SERVICE_NAMES.every((n) => state[n]) && onAllReadyCallback) {
    onAllReadyCallback();
  }
}

function onAllReady(callback) {
  onAllReadyCallback = callback;
}

function reset() {
  SERVICE_NAMES.forEach((n) => { state[n] = false; });
}

module.exports = { setReady, onAllReady, reset };
