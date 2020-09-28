import { OutMessage } from "@replikit/core/typings";
import { fromText } from "@replikit/messages";
import { prop, state, View, ViewAlreadyRegisteredError, ViewStorage } from "@replikit/views";

class TestView extends View {
    startFrom = prop(0);
    count = state(this.startFrom);

    increment(): void {
        this.count++;
        this.update();
    }

    render(): OutMessage {
        return fromText(`Count: ${this.count}`);
    }
}

describe("viewStorage", () => {
    it("should register a view and collect its composition info", () => {
        const viewStorage = new ViewStorage();
        viewStorage.register(TestView);
        expect(viewStorage._viewMap).toMatchSnapshot();
    });

    it("should throw an error if view with the same name already registered", () => {
        const viewStorage = new ViewStorage();
        viewStorage.register(TestView);
        expect(() => viewStorage.register(TestView)).toThrow(ViewAlreadyRegisteredError);
    });

    it("should create a view by name", () => {
        const viewStorage = new ViewStorage();
        viewStorage.register(TestView);
        const view = viewStorage.resolve(undefined!, "TestView", { messageIds: [456] });
        expect(view).toMatchSnapshot();
    });
});
