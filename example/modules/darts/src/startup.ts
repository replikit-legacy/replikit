import { createScope, hook } from "@replikit/core";
import { connection } from "@replikit/storage";
import { DartThrow } from "@example/darts";

/** @internal */
export const logger = createScope("darts");

hook("storage:database:done", () => {
    connection.registerRepository("throws", DartThrow);
});
