# Папка JAR-сервисов

Для работы Electron-приложения с бэкендом поместите сюда:

- `brok-core.jar`
- `brok-bpm.jar`
- `brok-context.jar`
- `brok-jre/` — кастомная JRE (см. ниже). Если папки нет, приложение использует системную `java` из PATH.

При сборке дистрибутива (`electron-builder`) содержимое этой папки копируется в `resources/jars` установленного приложения.

В dev-режиме приложение ищет JAR и JRE в этой папке в корне проекта.

## Сборка кастомной JRE (jlink)

Из корня проекта (нужен JDK) выполните:

```bash
jlink --add-modules java.base,java.logging,java.management,java.naming,java.net.http,java.sql,java.transaction.xa,java.xml,jdk.unsupported,java.desktop,java.security.jgss,java.instrument,java.rmi,java.scripting,java.compiler,jdk.crypto.ec,jdk.crypto.cryptoki,jdk.dynalink,java.security.sasl,jdk.naming.dns --output brok-jre --strip-debug --no-man-pages --no-header-files --compress=2
```

Готовую папку `brok-jre` переместите в `jars/` (должно получиться `jars/brok-jre/bin/java` или `java.exe` на Windows). Набор модулей при необходимости дополняют под зависимости ваших JAR.
