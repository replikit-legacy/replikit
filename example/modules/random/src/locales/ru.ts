import { locales } from "@replikit/i18n";
import { descriptions } from "@replikit/help";

locales.add("ru", "random", {
    channelPhotoDeleted: "Фото канала удалено",
    channelPhotoEdited: "Фото канала изменено:",
    accountJoined: account => `${account.username} присоединился к каналу`,
    accountLeft: account => `${account.username} покинул канал`,
    channelTitleEdited: channel => `Название канала изменено: ${channel.title}`,
    userEditedMessage: channel => `Попался редачер @${channel.username}`,
    dataDeleted: "[ДАННЫЕ УДАЛЕНЫ]",
    keepSilence: "всем молчать блять",
    deactivateSilentMode: "отмена режима молчания",
    silentModeActivated: "Активирован режим молчания",
    silentModeDeactivated: "Режим молчания деактивирован"
});

descriptions.add("ru", {
    edit: "Редактирует сообщение",
    delete: "Удаляет сообщение",
    calc: {
        sum: "Складывает два числа",
        mul: "Умножает два числа"
    },
    test: "Отображает информацию о сообщении",
    tokenize: "Разбивает текст сообщения на токены",
    format: "Создает текстовое сообщение из массива токенов"
});
