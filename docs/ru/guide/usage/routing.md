# Маршрутизация

Маршрутизация предоставляется пакетом `@replikit/router`.

Вы можете импортировать и использовать глобальный экземпляр маршрутизатора для построения цепочки обработчиков.
Для разных типов событий будет использоваться разный контекст:

```ts
import { router } from "@replikit/router";

// Используем метод of для выбора типа события
router.of("message:received").use(context => {
    if (context.message.text) {
        context.reply(`You said: ${context.message.text}`);
    }
});

router.of("account:joined").use(context => {
    const { account } = context;
    const name = account.firstName ?? account.username;
    context.reply(`Hi, ${name}!`);
});
```

Для передачи управления следующему обработчику в цепочке используется параметр-функция `next`:

```ts
import { router } from "@replikit/router";

router.of("message:received").use((context, next) => {
    console.log(`Message received: ${context.message.text}`);
    next();
});

router.of("message:received").use((context, next) => {
    if (!context.message.text) {
        next();
        return;
    }

    context.reply(`You said: ${context.message.text}`);
});
```

`next`, вызванный последним обработчиком цепочки, будет проигнорирован.

## Типы событий

| Имя                     | Описание                            | Контекст              |
| ----------------------- | ----------------------------------- | --------------------- |
| `message:received`      | Получено новое сообщение            | `MessageContext`      |
| `message:edited`        | Сообщение изменено                  | `MessageContext`      |
| `message:deleted`       | Сообщение удалено                   | `MessageContext`      |
| `account:joined`        | Пользователь присоединился к каналу | `AccountContext`      |
| `account:left`          | Пользователь покинул канал          | `AccountContext`      |
| `channel:title:edited`  | Название канала изменено            | `ChannelContext`      |
| `channel:photo:edited`  | Фото канала изменено                | `ChannelPhotoContext` |
| `channel:photo:deleted` | Фото канала удалено                 | `ChannelContext`      |
