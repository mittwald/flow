import stylelint from "stylelint";

const ruleName = "flow/unlayered-third-party-only";

/**
 * Not a real layer, but a build instruction handled by
 * `dev/vite/flowComponentsLayerPlugin.ts`: take this block out of every layer.
 */
const unlayeredMarker = "flow.unlayered";

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejectedTarget: (selector) =>
    `Unexpected "@layer ${unlayeredMarker}" on "${selector}". The escape hatch exists to beat CSS a third-party library injects at runtime, so its target has to be that library's selector, matched with :global(). Flow's own rules belong in the components layer, where consumers can still override them.`,
  rejectedLocation: () =>
    `Unexpected "@layer ${unlayeredMarker}" outside a component module stylesheet. The marker is only removed from src/components/**/*.module.{scss,css} — anywhere else it survives into the bundle and fails the build.`,
});

const isUnlayeredMarker = (atRule) =>
  atRule.name === "layer" && atRule.params.trim() === unlayeredMarker;

const isComponentModule = (file) => {
  const path = String(file ?? "").replaceAll("\\", "/");

  return (
    /(^|\/)src\/components\//.test(path) &&
    (path.endsWith(".module.scss") || path.endsWith(".module.css"))
  );
};

/**
 * Splits a selector at top-level separators, ignoring anything inside `(…)` or
 * `[…]` so that `:global(.a .b)` stays one token.
 */
const splitTopLevel = (selector, separators) => {
  const parts = [];
  let depth = 0;
  let current = "";

  for (const character of selector) {
    if (character === "(" || character === "[") {
      depth++;
    } else if (character === ")" || character === "]") {
      depth--;
    }

    if (depth === 0 && separators.includes(character)) {
      parts.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  parts.push(current);

  return parts.map((part) => part.trim()).filter(Boolean);
};

/** Every selector the rule matches, with `&` resolved against its ancestors. */
const resolveSelectors = (rule) => {
  const ancestors = [];

  for (let node = rule; node && node.type !== "root"; node = node.parent) {
    if (node.type === "rule") {
      ancestors.unshift(node.selector);
    }
  }

  return ancestors.reduce(
    (parents, selector) =>
      splitTopLevel(selector, ",").flatMap((part) =>
        parents.map((parent) =>
          part.includes("&")
            ? part.replaceAll("&", parent)
            : [parent, part].filter(Boolean).join(" "),
        ),
      ),
    [""],
  );
};

/**
 * The escape hatch may only target a third-party element: the rightmost
 * compound of the selector has to be a `:global()` of a class that is not
 * Flow's own. Flow classes further up the selector are expected — a third-party
 * element is usually addressed from inside a component.
 */
const targetsThirdParty = (selector) => {
  const compounds = splitTopLevel(selector, " >+~");
  const target = compounds.at(-1) ?? "";
  const globals = [...target.matchAll(/:global\(([^)]*)\)/g)];

  if (globals.length === 0) {
    return false;
  }

  const ownClasses = globals.some(([, inner]) => inner.includes(".flow--"));
  const outsideGlobals = target.replaceAll(/:global\([^)]*\)/g, "");

  return !ownClasses && !outsideGlobals.includes(".");
};

/** The rules an unlayered block applies to, in either authoring shape. */
const targetRulesOf = (marker) => {
  const nested = [];
  marker.walkRules((rule) => nested.push(rule));

  if (nested.length > 0) {
    return nested;
  }

  for (
    let node = marker.parent;
    node && node.type !== "root";
    node = node.parent
  ) {
    if (node.type === "rule") {
      return [node];
    }
  }

  return [];
};

const ruleFunction = (primary) => (root, result) => {
  if (
    !stylelint.utils.validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    })
  ) {
    return;
  }

  root.walkAtRules("layer", (marker) => {
    if (!isUnlayeredMarker(marker)) {
      return;
    }

    if (!isComponentModule(root.source?.input.from)) {
      stylelint.utils.report({
        message: messages.rejectedLocation(),
        node: marker,
        result,
        ruleName,
      });
      return;
    }

    for (const rule of targetRulesOf(marker)) {
      const selectors = resolveSelectors(rule);

      if (selectors.every(targetsThirdParty)) {
        continue;
      }

      stylelint.utils.report({
        message: messages.rejectedTarget(selectors.join(", ")),
        node: rule,
        result,
        ruleName,
      });
    }
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = {
  url: "https://github.com/mittwald/flow/blob/main/packages/components/PATTERNS.md",
};

export default stylelint.createPlugin(ruleName, ruleFunction);
