import { User, Channel, StorageLocale } from "@replikit/storage";
import { ConverterBuilderFactory } from "@replikit/commands/typings";
import { CommandsLocale } from "@replikit/commands";

type CommandsModule = typeof import("@replikit/commands");

function getCommands(): CommandsModule | undefined {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require("@replikit/commands") as CommandsModule;
    } catch {
        return undefined;
    }
}

export function registerStorageConverters(converter: ConverterBuilderFactory): void {
    converter(User)
        .validator((context, param) => {
            const id = +param;
            if (!isNaN(id)) {
                if (id > 0) {
                    return id;
                }

                const locale = context.getLocale(CommandsLocale);
                return locale.positiveNumberRequired;
            }
            return [param];
        })
        .resolver(async (context, param) => {
            const users = context.connection.getRepository(User);
            const locale = context.getLocale(StorageLocale);
            if (typeof param !== "number") {
                const user = await users.findOne({ username: param[0] });
                return user ?? locale.userNotFound;
            }
            const user = await users.findOne({ _id: param });
            return user ?? locale.userNotFound;
        })
        .register();

    converter(Channel)
        .validator((context, param) => {
            const id = +param;
            const locale = context.getLocale(CommandsLocale);
            if (!isNaN(id)) {
                return id > 0 ? id : locale.positiveNumberRequired;
            }
            return locale.numberRequired;
        })
        .resolver(async (context, param) => {
            const channels = context.connection.getRepository(Channel);
            const channel = await channels.findOne({ _id: param });
            const locale = context.getLocale(StorageLocale);
            return channel ?? locale.channelNotFound;
        })
        .register();
}

export function registerGlobalStorageConverters(): void {
    const commands = getCommands();
    if (!commands) {
        return;
    }
    registerStorageConverters(commands.converter);
}
