# Команды

Команды создаются функцией `command` из пакета `@replikit/commands`.

Вот так выглядит объявление простейшей команды:

```ts
import { command, commands } from "@replikit/commands";

// Создаем команду /hi и назначаем ей обработчик
const hi = command("hi").handler(context => {
    const { account } = context;
    const name = account.firstName ?? account.username;
    context.reply(`Hi, ${name}!`);
});

// Регистрируем команду
commands.register(hi);
```

Рекомендуется использовать метод `register` для автоматической регистрации команды:

```ts
import { command } from "@replikit/commands";

command("hi")
    .handler(context => {
        const { account } = context;
        const name = account.firstName ?? account.username;
        context.reply(`Hi, ${name}!`);
    })
    .register();
```

## Параметры

Вы можете объявлять параметры используя различные методы.
У каждого параметра обязательно должны быть указаны имя и тип (конструктор):

```ts
import { command } from "@replikit/commands";

command("sum")
    // Объявляем обязательный параметр "a" с типом number
    .required("a", Number)
    .required("b", Number)
    .handler(context => {
        // Используем объект params для доступа к параметрам
        const result = context.params.a + context.params.b;
        contest.reply(`a + b = ${result}`);
    })
    .register();
```

### Модификаторы

При объявлении параметра вы можете передать третьим аргументом объект с модификаторами.
Например, можно установить ограничение для числа:

```ts
import { command } from "@replikit/commands";

command("sum")
    // Объявляем обязательный положительный параметр "a" с типом number
    .required("a", Number, { positive: true })
    .required("b", Number, { positive: true })
    .handler(context => {
        // Используем объект params для доступа к параметрам
        const result = context.params.a + context.params.b;
        contest.reply(`a + b = ${result}`);
    })
    .register();
```

И тогда при попытке использовать неположительные значения пользователь получит ошибку:

```
> /sum 0 0
[a: Требуется положительное число]
Использование: /sum {a} {b}
```

Из коробки доступны следующие типы параметров и модификаторы:

| Тип       | Модификатор | Описание                                |
| --------- | ----------- | --------------------------------------- |
| `String`  | `minLength` | Минимальная длина строки                |
|           | `maxLength` | Максимальная длина строки               |
| `Number`  | `min`       | Минимальное значение                    |
|           | `max`       | Максимальное значение                   |
|           | `float`     | Разрешить вещественные значения         |
|           | `positive`  | Разрешить только положительные значения |
| `Boolean` | -           | -                                       |

### Опциональные параметры

Вы можете объявить опциональный параметр, используя метод `optional`:

```ts
import { command } from "@replikit/commands";

command("greet")
    // Объявляем опциональный параметр "name" с типом String
    .optional("name", String)
    .handler(context => {
        // Проверяем значение перед использованием
        const message = context.params.name
            ? `Hi, ${context.params.name}`
            : "Hi everybody";
        context.reply(message);
    })
    .register();
```

Любому опциональному параметру может быть задан модификатор `default` со значением по умолчанию.
В таком случае проверять наличие значения не нужно:

```ts
import { command } from "@replikit/commands";

command("greet")
    // Объявляем опциональный параметр "name" с типом String и значением по умолчанию
    .optional("name", String, { default: "Alex" })
    .handler(context => {
        context.reply(`Hi, ${context.params.name}`);
    })
    .register();
```

### Оставшиеся параметры

Оставшиеся параметры по умолчанию игнорируются.
Чтобы получить к ним доступ надо объявить их используя метод `rest`:

```ts
command("sum")
    .rest("numbers", Number)
    .handler(context => {
        // Используем массив params.numbers
        const result = context.params.numbers.reduce((a, b) => a + b, 0);
        contest.reply(`Result: ${result}`);
    })
    .register();
```

Оставшиеся параметры поддерживают несколько дополнительных модификаторов:

| Модификатор | Описание                           |
| ----------- | ---------------------------------- |
| `minCount`  | Минимальное количество параметров  |
| `maxCount`  | Максимальное количество параметров |

### Многострочный параметр

В каждой команде может быть только один `multiline` параметр.
Он включает в себя всё текстовое содержимое сообщения, начиная со второй строки.

```ts
import { command } from "@replikit/commands";

command("say")
    .required("name", String)
    .multiline("message")
    .handler(context => {
        context.reply(`${context.params.name}, ${context.params.message}`);
    })
    .register();
```

Использование команды из примера выше будет выглядеть следующим образом:

```
> /say Alex
> Why do you prefer JavaScript over TypeScript?
Alex, Why do you prefer JavaScript over TypeScript?
```

## Пользовательские параметры

Обработкой параметров различных типов занимаются соответствующие конвертеры.
Процесс обработки разделяется на два этапа: валидация и разрешение (распознавание).
Для работы конвертера будет достаточно одного валидатора или распознавателя.
В сложных случаях они используется вместе.
Разница в том, что валидатор обязательно должен быть синхронным, а распознаватели как правильно асинхронны.
Кроме того, после валидации всех параметров опционально происходит проверка доступа, в результате которой дальнейшее распознавание может не понадобиться.

Упрощенный конвертер для типа `User` в качестве примера:

```ts
import { converter } from "@replikit/commands";
import { connection, User } from "@replikit/storage";

converter(User)
    .validator((context, param) => {
        // Валидатор должен возвращать либо строку с сообщением об ошибке
        // Либо значение, которое будет передано в команду или распознавателю
        const id = parseInt(param);
        return isNaN(id) ? "User Id must be a number." : id;
    })
    .resolver(async (context, validationResult) => {
        const repository = connection.getRepository(User);
        // Получаем пользователя по идентификатору из базы данных
        // Используем validationResult, полученный из валидатора
        const user = await repository.findOne({ id: validationResult });
        return user;
    })
    .register();
```

## Возвращаемое значение

Команды могут возвращать значения, которые будут использованы для ответа.
Например:

```ts
import { command } from "@replikit/commands";
import { fromCode, MessageBuilder } from "@replikit/messages";

command("test1")
    // Отправляет строку
    .handler(() => "Hello")
    .register();

command("test2")
    // Отправляет строку в виде кода
    .handler(() => fromCode("Hello"))
    .register();

command("test3")
    // Отправляет сообщение с вложением
    .handler(() => {
        return new MessageBuilder()
            .addText("Hello")
            .addAttachment(...);
    })
    .register();
```

Обработчик может быть асинхронным и возвращать Promise.

## Вложенные команды

Команда также может содержать подкоманды.
При этом уровень вложенности не ограничен.
Например:

```ts
import { command } from "@replikit/commands";

command("calc")
    .commands(
        command("sum")
            .required("a", Number)
            .required("b", Number)
            .handler(({ params }) => `a + b = ${params.a + params.b}`),
        command("diff")
            .required("a", Number)
            .required("b", Number)
            .handler(({ params }) => `a - b = ${params.a - params.b}`)
    )
    .register();
```

Использование этой команды будет выглядеть следующим образом:

```
> /calc sum 2 7
2 + 7 = 9

> /calc diff 2 7
2 - 7 = -5
```

С помощью метода `default` можно задать подкоманду по умолчанию, например:

```ts
import { command } from "@replikit/commands";

command("calc")
    .default("sum")
    .commands(...)
    .register();
```

И использовать так:

```
> /calc 2 2
2 + 2 = 4
```
