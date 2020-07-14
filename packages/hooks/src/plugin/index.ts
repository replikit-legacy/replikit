import ts from "typescript";

const hookToMethodMap: Record<string, string> = {
    useRequired: "required",
    useOptional: "optional",
    useRest: "rest",
    useText: "text"
};

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

export default function(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    const typeChecker = program.getTypeChecker();
    return (ctx: ts.TransformationContext) => {
        function visitor(node: ts.Node): ts.Node {
            if (!ts.isCallExpression(node)) {
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
                const method = hookToMethodMap[node.expression.text];
                if (method) {
                    callExpression = ts.createCall(
                        ts.createPropertyAccess(callExpression, method),
                        undefined,
                        node.arguments
                    );
                }
                return node;
            }

            ts.visitEachChild(functionDeclaration.body, functionBodyVisitor, ctx);

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

            return ts.visitEachChild(sourceFile, visitor, ctx);
        };
    };
}
