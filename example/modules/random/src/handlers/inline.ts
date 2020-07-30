import { router } from "@replikit/router";
import { RandomUserSession } from "@example/random";
import { createHash } from "crypto";

router.of("inline-query:received").use(async context => {
    const user = await context.getSession(RandomUserSession);
    const text = context.query.text.trim();
    if (text && !user.completions.includes(text)) {
        user.completions.push(context.query.text);
    }
    await context.answer({
        results: user.completions.map(title => ({
            id: createHash("sha256")
                .update(title)
                .digest("hex"),
            article: { title }
        })),
        cacheTime: 0
    });
});
