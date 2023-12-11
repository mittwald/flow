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
    (statement): statement is ExportDefaultDeclaration =>
      statement.type === "ExportDefaultDeclaration",
  );

  if (
    defaultExport === undefined &&
    tree.program.body.some(
      (statement) => statement.type === "ExpressionStatement",
    )
  ) {
    const expressionStatement = tree.program.body.find(
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
    defaultExport.declaration.type === "FunctionDeclaration" ||
    defaultExport.declaration.type === "JSXFragment"
  ) {
    return extractCode(code, defaultExport.declaration);
  }

  throw Error("No default export or top-level expression found.");
}

function extractCode(
  code: string,
  expression: Expression | FunctionDeclaration,
) {
  if (expression.start == undefined || expression.end == undefined) {
    throw new Error("Cannot parse expression.");
  }
  if (expression.type === "JSXElement") {
    return code.slice(expression.start, expression.end);
  }
  if (expression.type === "JSXFragment") {
    if (
      !expression.children.every(
        (statement) => statement.start && statement.end,
      )
    ) {
      throw Error("JSX Fragment could not be parsed.");
    }
    return code.slice(
      expression.children.reduce((a, b) => Math.min(a, b.start!), 0),
      expression.children.reduce((a, b) => Math.max(a, b.end!), 0),
    );
  }
  if (expression.type === "ArrowFunctionExpression") {
    return code.slice(expression.start, expression.end);
  }
  if (expression.type === "FunctionDeclaration") {
    const returnStatement = expression.body.body.find(
      (statement): statement is ReturnStatement =>
        statement.type === "ReturnStatement",
    );
    if (
      returnStatement == undefined ||
      returnStatement.argument == undefined ||
      returnStatement.argument.start == undefined ||
      returnStatement.argument.end == undefined
    ) {
      throw Error("Function does not have a valid return statement.");
    }
    if (returnStatement.argument.type === "JSXFragment") {
      if (
        !returnStatement.argument.children.every(
          (statement) => statement.start && statement.end,
        )
      ) {
        throw Error("JSX Fragment could not be parsed.");
      }
      return code
        .slice(
          returnStatement.argument.children.reduce(
            (a, b) => Math.min(a, b.start!),
            returnStatement.argument.end,
          ),
          returnStatement.argument.children.reduce(
            (a, b) => Math.max(a, b.end!),
            returnStatement.argument.start,
          ),
        )
        .trim()
        .split("\n")
        .map((trimmedCode) => trimmedCode.trim())
        .join("\n");
    }
    return code.slice(
      returnStatement.argument.start,
      returnStatement.argument.end,
    );
  }

  throw Error("No parsable expression found.");
}
