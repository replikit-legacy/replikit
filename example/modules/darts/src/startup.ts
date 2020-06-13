import { createScope, hook } from "@replikit/core";
import { connection, User } from "@replikit/storage";
import { DartThrow } from "@example/darts";

/** @internal */
export const logger = createScope("darts");

hook("storage:database:done", () => {
    connection.registerRepository("throws", DartThrow);

    const users = connection.getRepository(User);
    users.setDefault("darts", { average: 0, sum: 0, total: 0 });
});
