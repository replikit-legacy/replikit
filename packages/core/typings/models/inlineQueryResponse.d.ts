import { InlineQueryResult } from "@replikit/core/typings";

export interface InlineQueryResponse {
    results: InlineQueryResult[];
    cacheTime?: number;
    isPersonal?: boolean;
    nextOffset?: string;
    switchPMText?: string;
    switchPMParameter?: string;
}
