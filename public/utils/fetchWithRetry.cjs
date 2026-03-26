/**
 * Опрос health-эндпоинта до ответа 200 и status: 'UP' (хотелка 4).
 * Как в рабочей версии: эмитит в LOADING_EVENTS, не держит ссылку на окно.
 * В main-процессе используем net.fetch.
 */
const { net } = require('electron');
const { RETRY_INTERVAL_MS, LOADING_EVENTS } = require('./serviceConfig.cjs');

function isHealthUp(body) {
  if (!body || typeof body !== 'object') return false;
  const status = body.status;
  return status != null && String(status).toUpperCase() === 'UP';
}

/**
 * В цикле запрашивает url до первого ответа 200 с body.status === 'UP'.
 * На каждой попытке эмитит LOADING_EVENTS.emit(progressEvent, false); при успехе — progressEvent true и finishedEvent.
 * @param {string} url — например http://localhost:21815/actuator/health
 * @param {{ progressEvent: string, finishedEvent: string }} eventNames — из SERVICE_CONFIG
 * @returns {Promise<void>}
 */
async function fetchWithRetry(url, eventNames) {
  const { progressEvent, finishedEvent } = eventNames;

  for (;;) {
    try {
      const res = await net.fetch(url);
      const body = await res.json().catch(() => ({}));
      if (res.status === 200 && isHealthUp(body)) {
        LOADING_EVENTS.emit(progressEvent, true);
        LOADING_EVENTS.emit(finishedEvent);
        return;
      }
      LOADING_EVENTS.emit(progressEvent, false);
    } catch (_) {
      LOADING_EVENTS.emit(progressEvent, false);
    }
    await new Promise((r) => setTimeout(r, RETRY_INTERVAL_MS));
  }
}

module.exports = { fetchWithRetry };
