import { ViewAlreadyRegisteredError, View } from "@replikit/views";
import { Constructor, MessageMetadata } from "@replikit/core/typings";
import { MessageContext } from "@replikit/router";
import { CompositionInfo, createCompositionInfo, createCompositionInstance } from "@replikit/core";

export class ViewStorage {
    /** @internal */
    readonly _viewMap = new Map<string, CompositionInfo>();

    private createViewInfo(constructor: Constructor<View>): CompositionInfo {
        return createCompositionInfo(constructor, {});
    }

    register<T extends View>(constructor: Constructor<T>): void {
        const name = constructor.name;
        if (this._viewMap.has(name)) {
            throw new ViewAlreadyRegisteredError(name);
        }
        const viewInfo = this.createViewInfo(constructor);
        this._viewMap.set(name, viewInfo);
    }

    resolve(
        context: MessageContext,
        name: string,
        metadata?: MessageMetadata,
        data?: unknown
    ): View | undefined {
        const viewInfo = this._viewMap.get(name);
        if (!viewInfo) return undefined;
        const viewContext = Object.assign({ metadata, _data: data ?? {} }, context);
        return createCompositionInstance(viewInfo, viewContext);
    }
}

export const viewStorage = new ViewStorage();
