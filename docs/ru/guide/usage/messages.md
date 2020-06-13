# Сообщения

Пакет `@replikit/messages` содержит весь необходимый инструментарий для работы с сообщениями.

## MessageBuilder

Самый мощный интерфейс в Replikit для создания сообщений; использует паттерн `Fluent Builder`.

```ts
import { MessageBuilder } from "@replikit/messages";
import { AttachmentType } from "@replikit/core";

// Простое сообщение с текстом
const message1 = new MessageBuilder()
    .addText("Hello")
    .build();

// Сообщение, состоящее из нескольких строк
const message2 = new MessageBuilder()
    .addLine("one")
    .addLine("two")
    .addLines(["three", "four"])
    .build();

// Сообщение, содержащее вложение
const message3 = new MessageBuilder()
    .addAttachmentByUrl(AttachmentType.Photo, "https://example.com/photo.png")
    .build();
```

## Сокращения

Для создания простых сообщений существуют функции - сокращения:

```ts
import { fromText, fromCode, fromAttachment } from "@replikit/messages";
import { AttachmentType } from "@replikit/core";

// Простое сообщение с текстом
const message1 = fromText("Hello");

// Простое сообщение с кодом
const message2 = fromCode("Hello");

// Сообщение, содержащее вложение
const message3 = fromAttachment({
    type: AttachmentType.Photo,
    url: "https://example.com/photo.png"
});
```
