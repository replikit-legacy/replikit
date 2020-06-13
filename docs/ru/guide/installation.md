# Установка

`Replikit` - модульный фреймворк. Он состоит из ядра, контроллеров и дополнительных пакетов, предоставляющих различную функциональность.
Для получения минимальной инсталяции вам понадобится всего два пакета: `@replikit/core` и какой-нибудь контроллер, например, `@replikit/telegram`.

Вы можете установить их из NPM:

```shell
npm install -D @replikit/core @replikit/telegram
# or
yarn add @replikit/core @replikit/telegram
```

И использовать в проекте:

```typescript
// Импортируем ядро
import { updateConfig, bootstrap } from "@replikit/core";

// Импортируем контроллер
import "@replikit/telegram";

// Задаем конфигурацию для контроллера
updateConfig({
    telegram: {
        token: "xxx"
    }
});

// Запускаем ядро
// Эта асинхронная функция запустит контроллеры, которые начнут обработку сообщений
bootstrap();
```

Существует и более удобный способ запуска ядра - [`Replikit CLI`](http://localhost:8080/replikit/ru/guide/usage/cli.html).
