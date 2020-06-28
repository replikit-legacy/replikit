import { MessageEvent, AccountInfo, ChannelInfo } from "@replikit/core/typings";
import { TestController } from "@replikit/test-utils";
import { ChannelType } from "@replikit/core";

const testController = new TestController();

export function createMessageEvent(): MessageEvent {
    const account: AccountInfo = {
        id: 1,
        firstName: "Test",
        lastName: "Test",
        username: "test"
    };
    const channel: ChannelInfo = {
        id: 1,
        permissions: {
            deleteMessages: false,
            deleteOtherMessages: false,
            editMessages: false,
            sendMessages: false
        },
        type: ChannelType.Unknown,
        title: "test"
    };
    return {
        type: "message:received",
        payload: {
            controller: testController,
            channel,
            account,
            message: {
                attachments: [],
                account,
                channel,
                forwarded: [],
                text: "test",
                metadata: { messageIds: [1] }
            }
        }
    };
}
