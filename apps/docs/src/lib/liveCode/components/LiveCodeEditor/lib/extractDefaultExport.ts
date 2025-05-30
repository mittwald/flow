import type {
  AnonymousFunctionDeclaration,
  ExportDefaultDeclaration,
  Expression,
  ExpressionStatement,
  FunctionDeclaration,
  ReturnStatement,
} from "acorn";
import { tsxParser } from "@/lib/tsxParser";

export default function extractDefaultExport(code: string): string {
  const tree = tsxParser.parse(code, {
    ecmaVersion: 14,
    sourceType: "module",
  });

  const defaultExport = tree.body.find(
    (statement): statement is ExportDefaultDeclaration =>
      statement.type === "ExportDefaultDeclaration",
  );

  if (
    defaultExport === undefined &&
    tree.body.some((statement) => statement.type === "ExpressionStatement")
  ) {
    const expressionStatement = tree.body.find(
      (statement): statement is ExpressionStatement =>
        statement.type === "ExpressionStatement",
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
    (defaultExport.declaration.type as string) === "JSXFragment" ||
    defaultExport.declaration.type === "FunctionDeclaration"
  ) {
    return extractCode(code, defaultExport.declaration as Expression);
  }

  throw Error("No default export or top-level expression found.");
}

function extractCode(
  code: string,
  expression: Expression | FunctionDeclaration | AnonymousFunctionDeclaration,
) {
  if (
    expression.type === "JSXElement" ||
    (expression.type as string) === "JSXFragment"
  ) {
    return code.slice(expression.start, expression.end);
  }
  if (expression.type === "ArrowFunctionExpression") {
    return code.slice(expression.start, expression.end);
  }
  if (expression.type === "FunctionDeclaration") {
    const returnStatement = expression.body.body.find(
      (statement): statement is ReturnStatement =>
        statement.type === "ReturnStatement",
    );
    if (returnStatement == undefined || returnStatement.argument == undefined) {
      throw Error("Function does not have return statement.");
    }
    return code.slice(
      returnStatement.argument.start,
      returnStatement.argument.end,
    );
  }

  throw Error("No parsable expression found.");
}
