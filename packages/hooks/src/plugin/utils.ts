import ts from "typescript";

export function createRequireCall(variableName: string, moduleName: string): ts.VariableStatement {
    return ts.createVariableStatement(
        undefined,
        ts.createVariableDeclarationList(
            [
                ts.createVariableDeclaration(
                    ts.createIdentifier(variableName),
                    undefined,
                    ts.createCall(ts.createIdentifier("require"), undefined, [
                        ts.createStringLiteral(moduleName)
                    ])
                )
            ],
            ts.NodeFlags.Const
        )
    );
}
