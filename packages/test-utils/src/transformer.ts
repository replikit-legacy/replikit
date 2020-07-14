import ts from "typescript";

type TransformerFactoryFunction = (program: ts.Program) => ts.TransformerFactory<ts.SourceFile>;

interface CustomTransformers {
    before?: TransformerFactoryFunction[];
    after?: TransformerFactoryFunction[];
}

function createTransformers(
    program: ts.Program,
    factories: TransformerFactoryFunction[] | undefined
): ts.TransformerFactory<ts.SourceFile>[] | undefined {
    if (!factories) {
        return undefined;
    }
    return factories.map(x => x(program));
}

export function transpileModule(code: string, transformers: Partial<CustomTransformers>): string {
    const host = ts.createCompilerHost({});
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalGetSourceFile = host.getSourceFile;
    const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.ES2018);
    host.getSourceFile = (fileName, version) => {
        if (fileName === "test.ts") {
            return sourceFile;
        }
        return originalGetSourceFile.call(host, fileName, version);
    };
    const program = ts.createProgram({ options: {}, rootNames: ["test.ts"], host });
    const customTransformers: ts.CustomTransformers = {};
    customTransformers.before = createTransformers(program, transformers.before);
    customTransformers.after = createTransformers(program, transformers.after);
    let result = "";
    const emitResult = program.emit(
        sourceFile,
        (_, content) => (result = content),
        undefined,
        undefined,
        customTransformers
    );
    if (emitResult.emitSkipped) {
        throw new Error("Emit skipped");
    }
    return result;
}
