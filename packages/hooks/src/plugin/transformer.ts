import ts from "typescript";
import { createRequireCall, FunctionNotModifiedError } from "@replikit/hooks/plugin";

function getCommandCallExpression(
    expession: ts.CallExpression
): [ts.CallExpression, ts.Identifier] | undefined {
    let callExpression = expession;
    let handler: ts.Identifier | undefined;
    while (ts.isPropertyAccessExpression(callExpression.expression)) {
        const propertyAccess = callExpression.expression;
        if (propertyAccess.name.text === "handler") {
            const handlerNode = callExpression.arguments[0];
            if (handlerNode && ts.isIdentifier(handlerNode)) {
                handler = handlerNode;
            }
        }
        if (!ts.isCallExpression(propertyAccess.expression)) {
            return undefined;
        }
        callExpression = propertyAccess.expression;
    }
    const identifier = callExpression.expression;
    return handler && ts.isIdentifier(identifier) && identifier.text === "command"
        ? [callExpression, handler]
        : undefined;
}

export function transformerFactory(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    const typeChecker = program.getTypeChecker();
    return (ctx: ts.TransformationContext) => {
        const usedFunctionBlocks: ts.Block[] = [];
        let hasHooksImport = false;
        let helperRequired = false;

        function createHelperCall(name: string, args: ts.Expression[]): ts.CallExpression {
            helperRequired = true;
            return ts.createCall(
                ts.createPropertyAccess(ts.createIdentifier("hooks_1"), name),
                undefined,
                args
            );
        }

        function visitor(node: ts.Node): ts.Node {
            if (ts.isBlock(node)) {
                const index = usedFunctionBlocks.indexOf(node);
                if (index === -1) {
                    return node;
                }
                usedFunctionBlocks.splice(index, 1);
                return ts.updateBlock(node, [
                    ts.createExpressionStatement(
                        createHelperCall("setContext", [
                            ts.createElementAccess(
                                ts.createIdentifier("arguments"),
                                ts.createNumericLiteral("0")
                            )
                        ])
                    ),
                    ...node.statements
                ]);
            }

            if (!ts.isCallExpression(node)) {
                if (ts.isImportDeclaration(node)) {
                    if (node.moduleSpecifier.getText() === '"@replikit/hooks"')
                        hasHooksImport = true;
                }
                return ts.visitEachChild(node, visitor, ctx);
            }

            const commandCallExpression = getCommandCallExpression(node);
            if (!commandCallExpression) {
                return node;
            }

            const symbol = typeChecker.getSymbolAtLocation(commandCallExpression[1]);
            if (!symbol) {
                return node;
            }

            const functionDeclaration = symbol.valueDeclaration;
            if (!functionDeclaration || !ts.isFunctionDeclaration(functionDeclaration)) {
                return node;
            }

            let callExpression = commandCallExpression[0];

            function functionBodyVisitor(node: ts.Node): ts.Node {
                if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression)) {
                    return ts.visitEachChild(node, functionBodyVisitor, ctx);
                }

                // Ignore awaiting calls
                if (ts.isAwaitExpression(node.expression.parent)) {
                    return node;
                }

                // Ignore all calls expect use(.*)
                if (!node.expression.text.startsWith("use")) {
                    return node;
                }

                callExpression = createHelperCall("applyHook", [
                    callExpression,
                    node.expression,
                    ts.createArrayLiteral(node.arguments)
                ]);
                return node;
            }

            ts.visitEachChild(functionDeclaration.body, functionBodyVisitor, ctx)!;
            usedFunctionBlocks.push(functionDeclaration.body!);

            let oldExpression = commandCallExpression[0].parent;
            while (ts.isPropertyAccessExpression(oldExpression)) {
                const oldCallExpression = oldExpression.parent;
                if (!ts.isCallExpression(oldCallExpression)) {
                    break;
                }

                callExpression = ts.createCall(
                    ts.createPropertyAccess(callExpression, oldExpression.name),
                    oldCallExpression.typeArguments,
                    oldCallExpression.arguments
                );

                oldExpression = oldCallExpression.parent;
            }

            return callExpression;
        }

        return (sourceFile: ts.SourceFile) => {
            if (sourceFile.isDeclarationFile) {
                return sourceFile;
            }

            const updatedFile = ts.visitEachChild(sourceFile, visitor, ctx);

            if (usedFunctionBlocks.length) {
                const declaration = usedFunctionBlocks[0].parent as ts.FunctionDeclaration;
                throw new FunctionNotModifiedError(declaration.name!.getText());
            }

            if (helperRequired && !hasHooksImport) {
                return ts.updateSourceFileNode(updatedFile, [
                    createRequireCall("hooks_1", "@replikit/hooks"),
                    ...updatedFile.statements
                ]);
            }

            return updatedFile;
        };
    };
}
