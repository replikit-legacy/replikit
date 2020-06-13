# Контроль доступа

## Роли и разрешения

Пакет `@replikit/permissions` предоставляет кастомизируемую систему ролей и разрешений.
Из коробки поддерживаются два типа разрешений: глобальные разрешения пользователя и разрешения пользователя в конкретном канале (разрешения участника).

## Объявление разрешений и ролей

В Replikit активно используется механизм расширения модулей. ([Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation))

Для объявления нового разрешения необходимо расширить интерфейс `UserPermissionMap` или `MemberPermissionMap` в зависимости от типа:

```ts
// Обязательно импортируем типы пакета, который надо расширить
import "@replikit/permissions/typings";

// Указываем полный путь до модуля, в котором находится интерфейс
// Это тоже обязательно, просто указать "@replikit/permissions/typings" не получится
// Для удобства большинство модулей с интерфейсами, которые можно расширить находятся
// в корне папки typings и называются в соответствии с интерфейсами в camelCase
declare module "@replikit/permissions/typings/userPermissionMap" {
    // Указываем интерфейс
    export interface UserPermissionMap {
        // Добавляем разрешения
        // Можно указывать абсолютно любой тип
        // void - cамый логичный и принятый в качестве соглашения
        manage_users: void;
    }
}

// Для объявления ролей необходимо расширить интерфейс UserRoleMap или MemberRoleMap
declare module "@replikit/permissions/typings/userRoleMap" {
    export interface UserRoleMap {
        Admin: void;
    }
}
```

Код выше должен находится в `d.ts` файлах и быть включен в компиляцию TypeScript вместе с другими исходными файлами.
Он объявляет разрешения только на уровне типов.
Благодаря ему вы можете получать от редактора подсказки и сообщения о несуществующих ролях или разрешениях.

Однако этот код не сообщит никакой информации системе разрешений Replikit, которая будет заниматься проверкой доступа
во время работы приложения. Поэтому необходимо также выполнить код, регистрирующий разрешения и роли:

```ts
import { permissions } from "@replikit/permissions";

// Добавляем разрешения, указывая тип
permissions.addPermissions("user", ["manage_users"]);

// Добавляем роль и указываем характерные разрешения
permissions.addRole("user", "Admin", {
    permissions: ["manage_users"]
});
```

### Наследование ролей

Рассмотрим ситуацию, когда в системе уже существует роль `Moderator` с разрешением `mute_users`
и надо добавить роль `Admin`, которая включает в себя все разрешения модератора + разрешение `manage_users`.
Такая система просто реализуется с помощью механизма наследования ролей:

```ts
permissions.addRole("user", "Moderator", {
    permissions: ["mute_users"]
});

permissions.addRole("user", "Admin", {
    permissions: ["manage_users"],
    // Добавляет Moderator как "родительскую" роль
    fallbackRoles: ["Moderator"]
});
```

## Методы сущностей

При подключении системы разрешений сущности `Member` и `User` получают следующие методы:

| Метод           | Описание                     |
| --------------- | ---------------------------- |
| `appoint`       | Выдает роль                  |
| `dismiss`       | Забирает роль                |
| `permit`        | Выдает разрешение            |
| `revoke`        | Отзывает разрешение          |
| `hasRole`       | Проверяет наличие роли       |
| `hasPermission` | Проверяет наличие разрешения |

```ts
import { connection, User } from "@replikit/storage";

const repository = connection.getRepository(User);
const user = repository.create({ username: "test" });

// Выдаем роль пользователю и сохраняем в бд
user.appoint("Admin");
await user.save();

// Получаем пользователя и проверяем роли и разрешения
const stored = await repository.findOne({ username: "test" });
console.assert(stored.hasRole("Admin"));
console.assert(stored.hasPermission("manage_users"));
```

## Авторизация

Пакет `@replikit/authorization` расширяет систему команд, добавляя авторизацию, основанную на разрешениях.

```ts
import { command } from "@replikit/commands";
import { User } from "@replikit/storage";

command("mute")
    .required("user", User)
    // Добавляем проверку определенного разрешения у вызывающего пользователя
    .authorizeUser("mute_users")
    .handler(...)
    .register();

command("hi")
    // Добавляем проверку определенного разрешения участника текущего канала
    .authorizeMember("greet_members")
    .handler(...)
    .register();
```

Используя метод `channel` можно добавить опциональный параметр, указывающий канал, в котором следует проверить разрешение (и выполнить какое-либо действие).
По умолчанию, значение этого параметра - текущий канал.

```ts
command("hi")
    .channel()
    // Добавляем проверку определенного разрешения участника указанного канала
    .authorizeMember("greet_members")
    .handler(...)
    .register();
```

В случае если пользователь не присутствует в указанном канале или не имеет указанное разрешение, бот вернет ошибку.
