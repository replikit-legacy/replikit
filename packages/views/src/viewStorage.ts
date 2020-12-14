import { ViewAlreadyRegisteredError, View, checkPattern } from "@replikit/views";
import { Constructor, MessageMetadata } from "@replikit/core/typings";
import { MessageContext } from "@replikit/router";
import { CompositionInfo, createCompositionInfo, createCompositionInstance } from "@replikit/core";
import { ViewTarget } from "@replikit/views/typings";

export class ViewStorage {
    /** @internal */
    readonly _viewMap = new Map<string, CompositionInfo<View>>();

    hasForceTextMode = false;

    private createViewInfo(constructor: Constructor<View>): CompositionInfo {
        return createCompositionInfo(constructor, {});
    }

    register<T extends View>(constructor: Constructor<T>): void {
        const name = constructor.name;
        if (this._viewMap.has(name)) {
            throw new ViewAlreadyRegisteredError(name);
        }
        const viewInfo = this.createViewInfo(constructor) as CompositionInfo<View>;
        if (viewInfo.fields.forceTextMode) {
            this.hasForceTextMode = true;
        }
        this._viewMap.set(name, viewInfo);
    }

    resolveByPattern(context: MessageContext): [View, string] | undefined {
        for (const viewInfo of this._viewMap.values()) {
            const patterns = viewInfo.fields.patterns;
            if (!patterns) {
                continue;
            }
            for (const method in patterns) {
                const pattern = patterns[method];
                if (checkPattern(context.message, pattern)) {
                    const view = this.createViewByInfo(viewInfo, context);
                    view._resolvedByPattern = true;
                    return [view, method];
                }
            }
        }
    }

    private createViewByInfo(
        viewInfo: CompositionInfo<View>,
        context: MessageContext,
        metadata?: MessageMetadata,
        data?: unknown
    ): View {
        const viewContext = Object.assign({}, context, {
            metadata,
            _data: data ?? {},
            closed: false,
            _session: undefined
        });
        return createCompositionInstance(viewInfo, viewContext);
    }

    resolve(
        context: MessageContext,
        name: string,
        metadata?: MessageMetadata,
        data?: unknown,
        target?: ViewTarget
    ): View | undefined {
        const viewInfo = this._viewMap.get(name);
        if (!viewInfo) return undefined;
        const view = this.createViewByInfo(viewInfo, context, metadata, data);
        view._target = target;
        return view;
    }
}

export const viewStorage = new ViewStorage();
