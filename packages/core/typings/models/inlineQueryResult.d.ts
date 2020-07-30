import {
    InlineQueryAttachment,
    InlineQueryArticle,
    InlineQueryInputText
} from "@replikit/core/typings";

export interface InlineQueryResultBase {
    id: string;
    message?: InlineQueryInputText;
}

export interface InlineQueryAttachmentResult extends InlineQueryResultBase {
    attachment: InlineQueryAttachment;
}

export interface InlineQueryArticleResult extends InlineQueryResultBase {
    article: InlineQueryArticle;
}

export type InlineQueryResult = InlineQueryAttachmentResult | InlineQueryArticleResult;
