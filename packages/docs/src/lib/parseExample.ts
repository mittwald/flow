import * as babelParser from "@babel/parser";
import {
  BlockStatement,
  ExportDefaultDeclaration,
  ExpressionStatement,
  FunctionDeclaration,
  JSXFragment,
  Node,
  Program,
  ReturnStatement,
} from "@babel/types";

export default function parseExample(code: string): string {
  const tree = babelParser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const defaultExport = tree.program.body.find(
    (statement): statement is ExportDefaultDeclaration =>
      statement.type === "ExportDefaultDeclaration",
  );

  if (defaultExport == undefined) {
    return extractToplevelStatement(code, tree.program);
  }

  return parseStatement(code, defaultExport.declaration);
}

function parseStatement(code: string, node: Node) {
  if (node.type === "ArrowFunctionExpression") {
    if (!checkValidity(node.body)) {
      throw new Error("Error parsing Arrow-Function.");
    }
    if (node.body.type === "JSXFragment") {
      return unwrapJSXFragment(code, node.body);
    }
    return code.slice(node.body.start!, node.body.end!);
  }

  if (node.type === "FunctionDeclaration") {
    if (!checkValidity(node.body)) {
      throw new Error("Error parsing Function.");
    }
    return extractReturnValue(code, node.body);
  }

  if (node.type === "JSXElement" || node.type === "JSXFragment") {
    if (!checkValidity(node)) {
      throw new Error("Error parsing Function.");
    }
    return node.type === "JSXFragment"
      ? unwrapJSXFragment(code, node)
      : code.slice(node.start!, node.end!);
  }
  console.log(node);
  throw new Error("No valid default export or top-level expression found.");
}

function extractToplevelStatement(code: string, program: Program) {
  if (program.body.some((value) => value.type === "ExpressionStatement")) {
    const topLevelExpression = program.body.find(
      (value): value is ExpressionStatement =>
        value.type === "ExpressionStatement",
    );
    if (!checkValidity(topLevelExpression)) {
      throw new Error("No valid default export or top-level expression found.");
    }
    return parseStatement(code, topLevelExpression!.expression);
  }
  const topLevelExpression = program.body.find(
    (value): value is FunctionDeclaration =>
      value.type === "FunctionDeclaration",
  );
  if (!checkValidity(topLevelExpression)) {
    throw new Error("No valid default export or top-level expression found.");
  }
  return parseStatement(code, topLevelExpression!);
}

function checkValidity(expression: Node | undefined | null) {
  return (
    expression != undefined &&
    expression.start != undefined &&
    expression.end != undefined
  );
}

function extractReturnValue(code: string, statement: BlockStatement) {
  const returnArgument = statement.body.find(
    (it): it is ReturnStatement => it.type === "ReturnStatement",
  )?.argument;

  if (!checkValidity(returnArgument)) {
    throw new Error("No Return statement found.");
  }

  if (returnArgument!.type === "JSXFragment") {
    return unwrapJSXFragment(code, returnArgument);
  }

  return code.slice(returnArgument!.start!, returnArgument!.end!);
}

function unwrapJSXFragment(code: string, fragment: JSXFragment) {
  const firstChildrenStart = fragment.children.reduce(
    (value, currentFragment) => Math.min(currentFragment.start!, value),
    fragment.end!,
  );
  const lastChildrenEnd = fragment.children.reduce(
    (value, currentFragment) => Math.max(currentFragment.end!, value),
    fragment.start!,
  );

  return code
    .slice(firstChildrenStart, lastChildrenEnd)
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}
