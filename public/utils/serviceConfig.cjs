/**
 * Конфигурация сервисов для health-check.
 * Единый источник правды для URL и имён IPC-каналов прогресса.
 * Паттерн как в рабочей версии: EventEmitter для связи fetchWithRetry → окно загрузки.
 */
const EventEmitter = require('events');

const LOADING_EVENTS = new EventEmitter();

const SERVICE_CONFIG = {
  CORE: {
    serviceName: 'core',
    url: 'http://localhost:21815/actuator/health',
    progressEvent: 'progressCore',
    finishedEvent: 'finishedCore',
  },
  BPM: {
    serviceName: 'bpm',
    url: 'http://localhost:21816/actuator/health',
    progressEvent: 'progressBpm',
    finishedEvent: 'finishedBpm',
  },
  CONTEXT: {
    serviceName: 'context',
    url: 'http://localhost:21817/actuator/health',
    progressEvent: 'progressContext',
    finishedEvent: 'finishedContext',
  },
};

const RETRY_INTERVAL_MS = 2000;

module.exports = { SERVICE_CONFIG, RETRY_INTERVAL_MS, LOADING_EVENTS };
