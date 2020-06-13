import { dir, file } from "tmp-promise";
import { write, close } from "fs-extra";

let disposers: Function[] = [];

export async function createTempDirectory(): Promise<string> {
    const result = await dir({ unsafeCleanup: true });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    disposers.push(result.cleanup);
    return result.path;
}

export async function createTempFile(): Promise<[string, number]> {
    const result = await file();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    disposers.push(result.cleanup);
    return [result.path, result.fd];
}

export async function writeTempFile(data: string | Buffer): Promise<string> {
    const [path, fd] = await createTempFile();
    await write(fd, data);
    await close(fd);
    return path;
}

async function disposeAll(): Promise<void> {
    await Promise.all(disposers.map(x => x()));
    disposers = [];
}

export function setupTemp(): void {
    beforeEach(disposeAll);
}
