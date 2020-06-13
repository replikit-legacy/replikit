import { FallbackStrategy } from "@replikit/storage";

export interface StorageConfiguration {
    connection: string;
    channelFallbackStrategy?: FallbackStrategy;
    userFallbackStrategy?: FallbackStrategy;
    memberFallbackStrategy?: FallbackStrategy;
}
