import { Webhook, TextChannel, User } from "discord.js";

export class WebhookStorage {
    private readonly webhookMap = new Map<string, Webhook>();

    public async resolve(me: User, channel: TextChannel): Promise<Webhook> {
        let webhook = this.webhookMap.get(channel.id);
        if (webhook) {
            return webhook;
        }

        const webhooks = await channel.fetchWebhooks();
        webhook = webhooks.find(x => x.name === me.username);
        if (webhook) {
            this.webhookMap.set(channel.id, webhook);
            // eslint-disable-next-line eqeqeq
            if (webhook.avatar != me.avatar) {
                await webhook.edit({ avatar: me.avatar ?? undefined });
            }
            return webhook;
        }

        webhook = await channel.createWebhook(me.username, { avatar: me.avatar ?? undefined });
        this.webhookMap.set(channel.id, webhook);
        return webhook;
    }
}
