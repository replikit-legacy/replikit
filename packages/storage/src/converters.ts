import { User, Channel } from "@replikit/storage";
import { ConverterBuilderFactory } from "@replikit/commands/typings";

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
                return id > 0 ? id : context.t.commands.positiveNumberRequired;
            }
            return [param];
        })
        .resolver(async (context, param) => {
            const users = context.connection.getRepository(User);
            if (typeof param !== "number") {
                const user = await users.findOne({ username: param[0] });
                return user ?? context.t.storage.userNotFound;
            }
            const user = await users.findOne({ _id: param });
            return user ?? context.t.storage.userNotFound;
        })
        .register();

    converter(Channel)
        .validator((context, param) => {
            const id = +param;
            if (!isNaN(id)) {
                return id > 0 ? id : context.t.commands.positiveNumberRequired;
            }
            return context.t.commands.numberRequired;
        })
        .resolver(async (context, param) => {
            const channels = context.connection.getRepository(Channel);
            const channel = await channels.findOne({ _id: param });
            return channel ?? context.t.storage.channelNotFound;
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
