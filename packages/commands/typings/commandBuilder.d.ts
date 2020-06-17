import { Parameters } from "@replikit/commands/typings";
import { HasFields } from "@replikit/core/typings";

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface CommandBuilder<
    C = HasFields,
    P extends Parameters = HasFields
> {}
