import {
    SourceFile,
    Project,
    ImportDeclaration,
    VariableDeclarationKind
} from "ts-morph";
import { transpileModule, ModuleKind } from "typescript";

function isModuleImport(node: ImportDeclaration): boolean {
    if (node.getDefaultImport()) {
        return false;
    }
    return !node.getNamedImports().length;
}

type ImportFilter = (importDeclaration: ImportDeclaration) => boolean;

function bySpecifier(module: string): ImportFilter {
    return (x): boolean => x.getModuleSpecifierValue() === module;
}

export class ConfigManager implements ConfigManager {
    private readonly project = new Project({
        compilerOptions: { tr: true }
    });
    private source: SourceFile;

    load(content: string): void {
        this.source = this.project.createSourceFile("", content);
    }

    compile(): string {
        const project = new Project();
        const config = project.createSourceFile(
            "config.ts",
            this.source.getFullText()
        );
        const imports = config.getImportDeclarations().filter(isModuleImport);
        const importArray = imports
            .map(x => x.getModuleSpecifier().getText())
            .join(", ");
        imports.forEach(x => x.remove());
        const text = transpileModule(config.getFullText(), {
            compilerOptions: { module: ModuleKind.CommonJS },
            reportDiagnostics: false
        }).outputText;
        config.delete();
        return text + `exports.modules = [${importArray}];`;
    }

    init(): void {
        this.source = this.project.createSourceFile("");
        this.source.addImportDeclaration({
            moduleSpecifier: "@replikit/core/typings",
            namedImports: ["Configuration"],
            trailingTrivia: writer => writer.blankLine()
        });
        this.source.addVariableStatement({
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
                { name: "config", type: "Configuration", initializer: "{}" }
            ],
            trailingTrivia: writer =>
                writer.blankLine().write("export default config;")
        });
    }

    addModule(module: string): void {
        const imports = this.source
            .getImportDeclarations()
            .filter(isModuleImport);
        const lastModuleImport = imports[imports.length - 1];
        if (!lastModuleImport) {
            this.source
                .addImportDeclaration({
                    moduleSpecifier: module,
                    leadingTrivia: writer => writer.blankLine()
                })
                .setOrder(1);
            return;
        }
        this.source
            .addImportDeclaration({ moduleSpecifier: module })
            .setOrder(lastModuleImport.getChildIndex() + 1);
    }

    removeModule(module: string): void {
        const moduleImport = this.getBySpecifier(module)!;
        const previousNode = moduleImport.getPreviousSibling();
        moduleImport.remove();
        if (previousNode) {
            previousNode.appendWhitespace(writer => writer.newLine());
        }
    }

    private getBySpecifier(module: string): ImportDeclaration | undefined {
        return this.source.getImportDeclaration(bySpecifier(module));
    }

    checkModule(module: string): boolean {
        return this.getBySpecifier(module) !== undefined;
    }

    serialize(): string {
        const text = this.source.getFullText();
        return text.endsWith("\n") ? text : text + "\n";
    }
}
