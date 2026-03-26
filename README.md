# Electron + Java: Полноценное desktop-приложение на стеке React + Java
![G4NQAQPdXIn5XB8k8wP5VWhNEUSphjPk8Yi6V7y0po8=](https://github.com/user-attachments/assets/109e0dfe-6062-44a6-ad03-3a2d70c87a84)
<img width="1003" height="708" alt="zE1mIlxvXqOx3jDk9QBNabEE32rip-EFK2nfIXoJW-E=" src="https://github.com/user-attachments/assets/50b134c4-71b1-4e31-b04e-a9c42c49933b" />

Демонстрационный проект для статьи на Хабре, показывающий архитектуру desktop-приложения с фронтендом на Electron и бэкендом на Java (Spring Boot).

## Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                    Electron (Main)                      │
│              Управление окнами, меню,                   │
│           нативная интеграция с ОС                      │
└─────────────────────────────────────────────────────────┘
                           │
                           │ IPC
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Electron (Renderer / Frontend)             │
│         React + TypeScript + Vite + TanStack Query      │
│              styled-components, react-hook-form         │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTP / REST API
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Java Backend                         │
│              Spring Boot 3.2.5 (Java 17)                │
│    Микросервисы: brok-core, brok-bpm, brok-context      │
│           Бизнес-логика, интеграции, вычисления         │
└─────────────────────────────────────────────────────────┘
```

## Стек технологий

### Frontend (Electron)
- **Electron** — фреймворк для создания desktop-приложений на веб-технологиях
- **React 18** — библиотека для построения UI
- **TypeScript** — статическая типизация
- **Vite** — сборка и HMR
- **TanStack Query** — управление серверным состоянием
- **styled-components** — CSS-in-JS стилизация
- **react-hook-form + Yup** — формы и валидация

### Backend (Java)
- **Java 17** — современная версия JVM
- **Spring Boot 3.2.5** — фреймворк для enterprise-приложений
- **Gradle** — система сборки (multi-module project)
- **Spring Boot Actuator** — health-чеки и мониторинг
- **CORS** — настроен для работы с Vite dev-server и Electron

### Модули бэкенда

| Модуль | Порт | Назначение | Startup delay |
|--------|------|------------|---------------|
| `brok-core` | 21815 | Основной REST API | 5 сек |
| `brok-bpm` | 21816 | Business Process Management | 10 сек |
| `brok-context` | 21817 | Контекстные данные | 15 сек |

## Быстрый старт

### Предварительные требования

- Node.js 18+
- Java 17+
- Gradle (wrapper включён в проект)

### Репозитории

Этот проект состоит из двух частей:
- **Frontend/Electron**: `brok-fe-example` (этот репозиторий)
- **Backend**: `brok-be-example` — Spring Boot микросервисы

### Установка

```bash
# 1. Клонирование frontend
git clone https://github.com/ojenya/brok-fe-example.git
cd brok-fe-example
npm install

# 2. Клонирование backend (в соседнюю папку)
cd ..
git clone https://github.com/ojenya/brok-be-example.git
cd brok-be-example
```

### Сборка и запуск бэкенда

```bash
cd brok-be-example

# Сборка всех модулей и копирование JAR в frontend
./gradlew copyJarsToDemo

# Или запуск модулей по отдельности (в разных терминалах)
./gradlew :brok-core:bootRun      # Порт 21815, стартует через 5 сек
./gradlew :brok-bpm:bootRun       # Порт 21816, стартует через 10 сек
./gradlew :brok-context:bootRun   # Порт 21817, стартует через 15 сек
```

### Запуск Electron в режиме разработки

```bash
cd brok-fe-example

# Если бэкенд уже запущен отдельно
npm run electron:dev

# Или запуск с загрузкой страницы ожидания
npm run dev
```

### API Endpoints

| Endpoint | Метод | Описание | Пример ответа |
|----------|-------|----------|---------------|
| `/core/api/hello` | GET | Тестовый endpoint | `{"message": "Hello from core"}` |
| `/core/api/status` | GET | Статус сервиса | `{"status": "UP"}` |
| `/actuator/health` | GET | Health-check | `{"status": "UP"}` |

### Сборка production-версии

```bash
# Сборка JAR бэкенда
cd brok-be-example
./gradlew copyJarsToDemo

# Сборка Electron приложения
cd ../brok-fe-example
npm run electron:build

# Дистрибутивы создаются в папке dist/
```

## Структура проекта

```
brok-fe-example/              # Frontend (этот репозиторий)
├── public/
│   ├── main.cjs              # Electron main process (CJS)
│   ├── preload.cjs           # Preload скрипт
│   └── loading.html          # Экран загрузки при старте
├── src/
│   ├── api/                  # API-клиенты (TanStack Query)
│   ├── components/           # React-компоненты
│   ├── forms/                # react-hook-form схемы
│   ├── hooks/                # Кастомные хуки
│   ├── styles/               # styled-components темы
│   └── types/                # TypeScript типы
├── jars/                     # JAR-файлы бэкенда (gitignore-ятся)
│   ├── brok-core.jar
│   ├── brok-context.jar
│   └── brok-bpm.jar
├── package.json
├── vite.config.ts
└── tsconfig.json

brok-be-example/              # Backend (отдельный репозиторий)
├── brok-core/                # Модуль core (порт 21815)
│   └── src/main/java/com/brok/core/
│       ├── BrokCoreApplication.java
│       ├── controller/DemoApiController.java
│       ├── dto/HelloResponse.java
│       └── config/WebConfig.java
├── brok-bpm/                 # Модуль BPM (порт 21816)
├── brok-context/             # Модуль context (порт 21817)
└── build.gradle
```

## Взаимодействие Frontend ↔ Backend

### REST API клиент

```typescript
// src/api/client.ts
const API_PORTS = {
  core: 21815,
  bpm: 21816,
  context: 21817,
};

export const apiClient = {
  async getCore<T>(endpoint: string): Promise<T> {
    const response = await fetch(`http://localhost:${API_PORTS.core}${endpoint}`);
    if (!response.ok) throw new Error('Core API Error');
    return response.json();
  },
};

// Использование
const { data } = useQuery({
  queryKey: ['hello'],
  queryFn: () => apiClient.getCore<{ message: string }>('/core/api/hello'),
});
```

### CORS конфигурация бэкенда

```java
// WebConfig.java — разрешает запросы из Electron и Vite
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173", "null")  // Vite + Electron file://
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

### IPC для нативных операций

```typescript
// public/preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Нативные диалоги
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (data) => ipcRenderer.invoke('dialog:saveFile', data),
  
  // Меню приложения
  onMenuClick: (callback) => ipcRenderer.on('menu:click', (_, action) => callback(action)),
  
  // Статус бэкенда
  onBackendStatus: (callback) => ipcRenderer.on('backend:status', (_, status) => callback(status)),
});
```

## Workflow разработки

1. **Backend-first**: Разрабатывайте API в `brok-be-example`, тестируйте через Actuator
2. **CORS**: Убедитесь что `WebConfig.java` разрешает `localhost:5173` для Vite dev server
3. **Startup sequence**: Запускайте модули в порядке: core → bpm → context (с учётом delay)
4. **Hot reload**: Vite + React Refresh для быстрой разработки UI
5. **Type safety**: Используйте `openapitools.json` для генерации TypeScript-типов из Java API

## Health Checks и мониторинг

Каждый модуль Spring Boot предоставляет health endpoints:

```bash
# Проверка статуса core
curl http://localhost:21815/actuator/health

# Проверка статуса bpm  
curl http://localhost:21816/actuator/health

# Проверка статуса context
curl http://localhost:21817/actuator/health
```
