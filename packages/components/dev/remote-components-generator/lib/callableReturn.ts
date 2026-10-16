import * as docgen from "react-docgen-typescript";
import ts from "typescript";

/**
 * What the host gets back when it calls a prop that crossed the remote boundary
 * as a function proxy — the fact `checkSerializableProps` needs, read from the
 * TypeScript type instead of its printed name:
 *
 * - `rendered-output` — React output (a render function, a component type)
 * - `value` — a value the caller reads synchronously
 * - `unread` — nothing the caller reads (`void`, `undefined`, `never`, `any`,
 *   `unknown`), or a declared `Promise` the caller already awaits
 *
 * A prop that is not callable has none.
 */
export type CallableReturn = "rendered-output" | "value" | "unread";

declare module "react-docgen-typescript" {
  interface PropItemType {
    callableReturn?: CallableReturn;
  }
}

const severity: Record<CallableReturn, number> = {
  unread: 0,
  value: 1,
  "rendered-output": 2,
};

const worst = (
  a: CallableReturn | undefined,
  b: CallableReturn | undefined,
): CallableReturn | undefined =>
  a === undefined ? b : b === undefined || severity[a] >= severity[b] ? a : b;

const renderedOutputName =
  /\b(ReactNode|ReactElement|ReactPortal|JSX\.Element)\b/;

const unreadFlags =
  ts.TypeFlags.Void |
  ts.TypeFlags.Undefined |
  ts.TypeFlags.Never |
  ts.TypeFlags.Any |
  ts.TypeFlags.Unknown;

const membersOf = (type: ts.Type): readonly ts.Type[] =>
  type.isUnion() ? type.types : [type];

const isPromise = (type: ts.Type) =>
  ["Promise", "PromiseLike"].includes(type.getSymbol()?.getName() ?? "");

const classifyReturn = (
  checker: ts.TypeChecker,
  returnType: ts.Type,
): CallableReturn => {
  const members = membersOf(returnType);

  if (
    renderedOutputName.test(checker.typeToString(returnType)) ||
    members.some((member) => {
      const symbol = member.aliasSymbol ?? member.getSymbol();
      return (
        symbol !== undefined &&
        renderedOutputName.test(checker.getFullyQualifiedName(symbol))
      );
    })
  ) {
    return "rendered-output";
  }

  if (
    members.some(isPromise) ||
    members.every((member) => (member.getFlags() & unreadFlags) !== 0)
  ) {
    return "unread";
  }

  return "value";
};

/*
 * How deep to follow arrays and tuples: `PluggableList` is an array of a
 * union whose tuple arm holds the function, which is two levels.
 */
const maxDepth = 3;

/**
 * Classifies every function the host could receive in `type`: the type itself,
 * each arm of a union, and the elements of arrays and tuples (react-markdown's
 * `PluggableList`). It does not look into the properties of objects.
 */
export const callableReturnOf = (
  checker: ts.TypeChecker,
  type: ts.Type,
  depth = 0,
): CallableReturn | undefined => {
  if (depth > maxDepth) {
    return undefined;
  }

  if (type.isUnion()) {
    return type.types
      .map((member) => callableReturnOf(checker, member, depth))
      .reduce(worst, undefined);
  }

  if (checker.isArrayType(type) || checker.isTupleType(type)) {
    return checker
      .getTypeArguments(type as ts.TypeReference)
      .map((element) => callableReturnOf(checker, element, depth + 1))
      .reduce(worst, undefined);
  }

  return [...type.getCallSignatures(), ...type.getConstructSignatures()]
    .map((signature) => classifyReturn(checker, signature.getReturnType()))
    .reduce<CallableReturn | undefined>(worst, undefined);
};

/**
 * Runs `parse` with docgen's prop types extended by `callableReturn`.
 *
 * React-docgen-typescript only keeps the printed type, and for an alias that is
 * just the alias name. It has no hook for extra type facts, so its
 * `getDocgenType` is wrapped for the duration of the call. The checker is the
 * one of the program docgen parses, so the types it hands over belong to it.
 */
export const withCallableReturns = <T>(
  checker: ts.TypeChecker,
  parse: () => T,
): T => {
  const prototype = docgen.Parser.prototype;
  const getDocgenType = prototype.getDocgenType;

  prototype.getDocgenType = function (propType, isRequired) {
    const docgenType = getDocgenType.call(this, propType, isRequired);
    const callableReturn = callableReturnOf(
      checker,
      propType.getConstraint() ?? propType,
    );
    return callableReturn ? { ...docgenType, callableReturn } : docgenType;
  };

  try {
    return parse();
  } finally {
    prototype.getDocgenType = getDocgenType;
  }
};
