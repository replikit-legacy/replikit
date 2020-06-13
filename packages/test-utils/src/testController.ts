/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from "@replikit/core";
import {
    ResolvedMessage,
    AccountInfo,
    ChannelInfo,
    SendedMessage
} from "@replikit/core/typings";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TestControllerOptions {
    name?: string;
    sendedMessage?: SendedMessage;
}

export class TestController extends Controller {
    constructor(private readonly testOptions?: TestControllerOptions) {
        super({
            name: testOptions?.name ?? "test",
            features: {
                implicitUpload: true
            }
        });
    }

    deleteMessage(channelId: number, id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

    protected fetchChannelInfo(
        localId: number
    ): Promise<ChannelInfo | undefined> {
        throw new Error("Method not implemented.");
    }

    protected fetchAccountInfo(
        localId: number
    ): Promise<AccountInfo | undefined> {
        throw new Error("Method not implemented.");
    }

    protected sendResolvedMessage(
        channelId: number,
        message: ResolvedMessage
    ): Promise<SendedMessage> {
        if (message.text) {
            expect(message.text).toMatchSnapshot();
        }
        const result =
            this.testOptions?.sendedMessage ?? this.createSendedMessage();
        return Promise.resolve(result);
    }

    private createSendedMessage(): SendedMessage {
        return {
            attachments: [],
            id: 0,
            metadata: { firstAttachment: false, messageIds: [] }
        };
    }

    protected editResolvedMessage(
        channelId: number,
        message: ResolvedMessage
    ): Promise<SendedMessage> {
        expect(message.text).toMatchSnapshot();
        const result =
            this.testOptions?.sendedMessage ?? this.createSendedMessage();
        return Promise.resolve(result);
    }
}
