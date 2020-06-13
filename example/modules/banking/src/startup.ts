import { createScope, hook } from "@replikit/core";
import { connection, User } from "@replikit/storage";

/** @internal */
export const logger = createScope("banking");

hook("storage:database:done", () => {
    const repository = connection.getRepository(User);
    repository.setDefault("banking", { money: 0 });
});
