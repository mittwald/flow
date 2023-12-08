import * as babelParser from "@babel/parser";
import {
  ExportDefaultDeclaration,
  Expression,
  ExpressionStatement,
  FunctionDeclaration,
  ReturnStatement,
} from "@babel/types";

export default function extractDefaultExport(code: string): string {
  const tree = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const defaultExport = tree.program.body.find(
    (it): it is ExportDefaultDeclaration =>
      it.type === "ExportDefaultDeclaration",
  );

  if (
    defaultExport === undefined &&
    tree.program.body.some((it) => it.type === "ExpressionStatement")
  ) {
    const expressionStatement = tree.program.body.find(
      (it): it is ExpressionStatement => it.type === "ExpressionStatement",
    );
    if (expressionStatement == undefined) {
      throw new Error("Default export needs to be expression.");
    }
    return extractCode(code, expressionStatement.expression as Expression);
  }
  if (defaultExport === undefined) {
    throw new Error("Could not find default export");
  }

  if (
    defaultExport.declaration.type === "ArrowFunctionExpression" ||
    defaultExport.declaration.type === "JSXElement" ||
    defaultExport.declaration.type === "FunctionDeclaration" ||
    defaultExport.declaration.type === "JSXFragment"
  ) {
    return extractCode(code, defaultExport!.declaration);
  }

  throw Error("No default export or top-level expression found.");
}

function extractCode(
  code: string,
  expression: Expression | FunctionDeclaration,
) {
  if (expression.type === "JSXElement") {
    return code.slice(expression.start!, expression.end!);
  }
  if (expression.type === "JSXFragment") {
    return code.slice(
      expression.children.reduce((a, b) => Math.min(a, b.start!), 0),
      expression.children.reduce((a, b) => Math.max(a, b.end!), 0),
    );
  }
  if (expression.type === "ArrowFunctionExpression") {
    return code.slice(expression.start!, expression.end!);
  }
  if (expression.type === "FunctionDeclaration") {
    const returnStatement = expression.body.body.find(
      (it): it is ReturnStatement => it.type === "ReturnStatement",
    );
    if (returnStatement == undefined || returnStatement.argument == undefined) {
      throw Error("Function does not have return statement.");
    }
    if (returnStatement.argument.type === "JSXFragment") {
      const trimmedCode = code
        .slice(
          returnStatement.argument.children.reduce(
            (a, b) => Math.min(a, b.start!),
            returnStatement.argument.end!,
          ),
          returnStatement.argument.children.reduce(
            (a, b) => Math.max(a, b.end!),
            returnStatement.argument.start!,
          ),
        )
        .trim()
        .split("\n")
        .map((it) => it.trim())
        .join("\n");
      return trimmedCode;
    }
    return code.slice(
      returnStatement.argument.start!,
      returnStatement.argument.end!,
    );
  }

  throw Error("No parsable expression found.");
}
