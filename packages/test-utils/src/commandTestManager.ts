import { TestController, TestControllerOptions } from "@replikit/test-utils";
import {
    Router,
    ContextFactoryStorage,
    registerBasicContextFactories
} from "@replikit/router";
import { InMessage, ChannelPermissionMap } from "@replikit/core/typings";
import {
    CommandStorage,
    ConverterStorage,
    createConverterBuilderFactory,
    registerBasicConverters,
    CommandBuilderFactory,
    createCommandBuilderFactory
} from "@replikit/commands";
import { ConverterBuilderFactory } from "@replikit/commands/typings";
import { ChannelType } from "@replikit/core";
import { registerStorageConverters } from "@replikit/storage";

export interface CommandTestManagerOptions extends TestControllerOptions {
    excludeBasicConverters?: boolean;
    excludeStorageConverters?: boolean;
}

export class CommandTestManager {
    readonly contextFactories = new ContextFactoryStorage();
    readonly router = new Router(this.contextFactories);

    readonly converters = new ConverterStorage();
    readonly converter = createConverterBuilderFactory(this.converters);

    readonly commands = new CommandStorage();
    readonly command = createCommandBuilderFactory(
        this.commands,
        this.converters
    );

    readonly controller: TestController;

    constructor(private readonly options?: CommandTestManagerOptions) {
        this.controller = new TestController(options);
        this.router
            .of("message:received")
            .use(this.commands.process.bind(this.commands));
        if (!options?.excludeBasicConverters) {
            registerBasicConverters(this.converter);
        }
        if (!options?.excludeStorageConverters) {
            registerStorageConverters(this.converter);
        }
        registerBasicContextFactories(this.contextFactories);
    }

    processCommand(text: string, accountId = 0): Promise<void> {
        const message: InMessage = {
            id: 0,
            text: text,
            account: { id: accountId },
            channel: {
                id: 0,
                permissions: {} as ChannelPermissionMap,
                type: ChannelType.Unknown
            },
            attachments: [],
            forwarded: [],
            metadata: { firstAttachment: false, messageIds: [0] }
        };
        return this.router.process({
            type: "message:received",
            payload: {
                message,
                account: message.account,
                channel: message.channel,
                controller: this.controller
            }
        });
    }
}

export interface TestManagerSuite {
    testManager: CommandTestManager;
    command: CommandBuilderFactory;
    converter: ConverterBuilderFactory;
}

export function createTestManager(
    options?: CommandTestManagerOptions
): TestManagerSuite {
    const testManager = new CommandTestManager(options);
    return {
        testManager,
        command: testManager.command,
        converter: testManager.converter
    };
}
