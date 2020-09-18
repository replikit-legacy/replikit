import { ViewInfo } from "@replikit/views/typings";
import { ViewAlreadyRegisteredError, View, ViewField } from "@replikit/views";
import { Constructor, HasFields, Identifier, MessageMetadata } from "@replikit/core/typings";
import { MessageContext } from "@replikit/router";

export class ViewStorage {
    /** @internal */
    readonly _viewMap = new Map<string, ViewInfo>();

    private createViewInfo(constructor: Constructor<View>): ViewInfo {
        const instance = (new constructor() as unknown) as HasFields;
        const result: ViewInfo = {
            fields: [],
            prototype: constructor.prototype
        };
        for (const field in instance) {
            const value = instance[field];
            if (value instanceof ViewField) {
                value.name = field;
                result.fields.push(value);
                continue;
            }
        }
        return result;
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
        channelId: Identifier,
        metadata?: MessageMetadata
    ): View | undefined {
        const viewInfo = this._viewMap.get(name);
        if (!viewInfo) return undefined;
        const view = Object.create(viewInfo.prototype);
        view.info = viewInfo;
        view.context = context;
        view.channelId = channelId;
        view.metadata = metadata;
        return view as View;
    }
}

export const viewStorage = new ViewStorage();
