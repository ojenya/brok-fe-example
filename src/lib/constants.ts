import { Configuration } from '../generated-sources/core/runtime';
import { InternalRequestMiddleware } from './InternalRequestMiddleware';

declare global {
  interface Window {
    basePath?: string;
  }
}

export const BASE_PARAMS = {
  basePath: typeof window !== 'undefined' ? window.basePath ?? '' : '',
  credentials: 'include' as RequestCredentials,
  headers: { 'Content-Type': 'application/json' },
  middleware: [new InternalRequestMiddleware()],
};

export const coreApiConfig = new Configuration(BASE_PARAMS);
