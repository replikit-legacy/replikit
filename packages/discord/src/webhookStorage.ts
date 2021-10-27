import { Webhook, TextChannel, User } from "discord.js";

export class WebhookStorage {
    private readonly webhookMap = new Map<string, Webhook>();

    public async resolve(me: User, channel: TextChannel): Promise<Webhook> {
        let webhook = this.webhookMap.get(channel.id);
        if (webhook) {
            return webhook;
        }

        const avatarUrl = me.avatarURL();

        const webhooks = await channel.fetchWebhooks();
        webhook = webhooks.find(x => x.name === me.username);
        if (webhook) {
            this.webhookMap.set(channel.id, webhook);

            if (webhook.avatarURL() != avatarUrl) {
                await webhook.edit({ avatar: avatarUrl ?? undefined });
            }

            return webhook;
        }

        webhook = await channel.createWebhook(me.username, { avatar: avatarUrl ?? undefined });
        this.webhookMap.set(channel.id, webhook);
        return webhook;
    }
}
