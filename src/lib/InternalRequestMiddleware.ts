import type { RequestContext, FetchParams } from '../generated-sources/core/runtime';

const CORE_ORIGIN = 'http://localhost:21815';

/**
 * Всегда перенаправляет запросы к /core на localhost:21815.
 * - В Electron (file://) относительные запросы не имеют хоста — подставляем 21815.
 * - В dev (http://localhost:5173) без подмены запрос шёл бы на 5173; Vite proxy мог не срабатывать,
 *   поэтому тоже отправляем на 21815. Бэкенд (brok-core) настроен с CORS для localhost:5173 и null.
 */
export class InternalRequestMiddleware {
  public async pre(context: RequestContext): Promise<FetchParams | void> {
    if (typeof window === 'undefined') return;

    const path = context.url.startsWith('http')
      ? new URL(context.url).pathname
      : context.url;

    if (!path.startsWith('/core')) return;

    return {
      url: `${CORE_ORIGIN}${path}`,
      init: {
        ...context.init,
        headers: new Headers(context.init?.headers ?? {}),
      },
    };
  }
}
