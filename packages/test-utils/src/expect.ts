import { readFile } from "fs-extra";
import { readdir, stat } from "fs-extra";
import { join } from "path";

async function expectItemToMatchSnapshot(
    base: string,
    path: string
): Promise<void> {
    const fullPath = join(base, path);
    const info = await stat(fullPath);

    if (info.isFile()) {
        const content = await readFile(fullPath, "utf8");
        expect(content).toMatchSnapshot(path);
        return;
    }

    if (info.isDirectory()) {
        const items = await readdir(fullPath);
        for (const item of items) {
            const itemPath = join(path, item).replace(/\\/gm, "/");
            await expectItemToMatchSnapshot(base, itemPath);
        }
    }
}

export async function expectDirectoryToMatchSnapshot(
    directory: string
): Promise<void> {
    await expectItemToMatchSnapshot(directory, "/");
}
