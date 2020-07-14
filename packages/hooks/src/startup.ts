import { router } from "@replikit/router";
import { startContextTracking } from "@replikit/hooks";

router.of("message:received").use(startContextTracking);
