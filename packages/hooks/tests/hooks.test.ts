import { command } from "@replikit/commands";
import {
    applyHook,
    useRequired,
    useOptional,
    useText,
    useRest,
    useChannel,
    useUser,
    useMember
} from "@replikit/hooks";
import "@replikit/storage";

describe("useRequired hook", () => {
    it("should add a required parameter to command", () => {
        const builder = command("test");
        applyHook(builder, useRequired, ["p1", Number, {}]);
        expect(builder.build()).toMatchSnapshot();
    });
});

describe("useOptional hook", () => {
    it("should add an optional parameter to command", () => {
        const builder = command("test");
        applyHook(builder, useOptional, ["p2", Boolean, { default: true }]);
        expect(builder.build()).toMatchSnapshot();
    });
});

describe("useText hook", () => {
    it("should add a text parameter to command", () => {
        const builder = command("test");
        applyHook(builder, useText, []);
        expect(builder.build()).toMatchSnapshot();
    });
});

describe("useRest hook", () => {
    it("should add a rest parameter to command", () => {
        const builder = command("test");
        applyHook(builder, useRest, ["p3", String]);
        expect(builder.build()).toMatchSnapshot();
    });
});

describe("useChannel hook", () => {
    it("should add a channel parameter to command", () => {
        const builder = command("test");
        applyHook(builder, useChannel, []);
        expect(builder.build()).toMatchSnapshot();
    });
});

describe("useUser hook", () => {
    it("should add a user parameter to command", () => {
        const builder = command("test");
        applyHook(builder, useUser, []);
        expect(builder.build()).toMatchSnapshot();
    });
});

describe("useMember hook", () => {
    it("should add a member parameter to command", () => {
        const builder = command("test");
        applyHook(builder, useMember, []);
        expect(builder.build()).toMatchSnapshot();
    });
});
