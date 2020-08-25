import { Webhook, TextChannel } from "discord.js";
import { config } from "@replikit/core";

export class WebhookStorage {
    private readonly webhookMap = new Map<string, Webhook>();

    public async resolve(channel: TextChannel): Promise<Webhook> {
        let webhook = this.webhookMap.get(channel.id);
        if (webhook) {
            return webhook;
        }

        const webhooks = await channel.fetchWebhooks();
        webhook = webhooks.find(x => x.name === config.discord.webhookName);
        if (webhook) {
            this.webhookMap.set(channel.id, webhook);
            return webhook;
        }

        webhook = await channel.createWebhook(config.discord.webhookName, undefined);
        this.webhookMap.set(channel.id, webhook);
        return webhook;
    }
}
