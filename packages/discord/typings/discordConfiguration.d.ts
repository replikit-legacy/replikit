export interface DiscordConfiguration {
    token: string;

    /**
     * Prevent using webhooks for messages with links and multiple attachments.
     * Messages sended by webhooks can be deleted, but can't be edited,
     * so there is an option to disable webhooks and use alternative methods.
     *
     * **Note that webhooks still will be used to send messages with header because there is no alternative for them.**
     * @default false
     */
    disableWebhooks?: boolean;
}
