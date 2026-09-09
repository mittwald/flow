import fs from "node:fs";
import path from "node:path";
import stylelint from "stylelint";
import { cssModuleClassNameGenerator } from "../vite/cssModuleClassNameGenerator.ts";

const ruleName = "flow/no-unknown-global-flow-class";

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (className, suggestion) =>
    `Unexpected ":global(.${className})" — no Flow component generates that class, so the selector matches nothing. ${
      suggestion ? `Did you mean ".${suggestion}"? ` : ""
    }Generated names come from the component's path and drop the suffix when it equals the component name (dev/vite/cssModuleClassNameGenerator.ts), so they cannot be derived by hand — copy the name from the component's *.module.d.scss.ts. If you just added the class, regenerate the stubs first: pnpm nx build:scss-types components.`,
});

const componentsSrc = path.resolve(import.meta.dirname, "../../src");

const walk = (dir, files = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const child = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(child, files);
    } else if (/\.module\.d\.s?css\.ts$/.test(entry.name)) {
      files.push(child);
    }
  }

  return files;
};

/**
 * Every `flow--…` class the component build emits, derived from the committed
 * `*.module.d.scss.ts` stubs — the only source that also lists classes a mixin
 * or an interpolation produces — run through the very generator the build uses.
 * Reading the built `dist/css/all.css` instead would be circular: a `:global()`
 * selector is emitted verbatim, so a broken reference would find itself there.
 */
export const collectKnownGlobalFlowClasses = (src = componentsSrc) => {
  const known = new Set();

  for (const stub of walk(src)) {
    const stylesheet = stub.replace(/\.d\.(s?css)\.ts$/, ".$1");

    for (const [, quoted, bare] of fs
      .readFileSync(stub, "utf8")
      .matchAll(/readonly\s+(?:"([^"]+)"|([\w$]+))\s*:/g)) {
      const localName = quoted ?? bare;

      // A stub lists every class its stylesheet mentions, `:global()` targets
      // included. Feeding those back in would let a broken reference help
      // vouch for itself, so drop them: a local class is camelCase, never
      // already a generated name.
      if (localName.startsWith("flow--")) {
        continue;
      }

      known.add(cssModuleClassNameGenerator(localName, stylesheet));
    }
  }

  return known;
};

let knownClasses;

/** Levenshtein distance, capped — only used to name a likely typo. */
const distance = (a, b) => {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];

    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }

    previous = current;
  }

  return previous[b.length];
};

const suggestionFor = (className, known) => {
  let best;
  let bestDistance = Math.ceil(className.length / 3);

  for (const candidate of known) {
    const candidateDistance = distance(className, candidate);

    if (candidateDistance <= bestDistance) {
      best = candidate;
      bestDistance = candidateDistance;
    }
  }

  return best;
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

  knownClasses ??= collectKnownGlobalFlowClasses();

  root.walkRules((rule) => {
    const selector = rule.raws.selector?.raw ?? rule.selector;

    for (const global of selector.matchAll(/:global\(([^)]*)\)/g)) {
      for (const reference of global[1].matchAll(/\.(flow--[\w-]+)/g)) {
        const className = reference[1];

        if (knownClasses.has(className)) {
          continue;
        }

        // `+ 1` skips the `.` so the caret sits on the name itself.
        const nameIndex =
          global.index + ":global(".length + reference.index + 1;

        stylelint.utils.report({
          message: messages.rejected(
            className,
            suggestionFor(className, knownClasses),
          ),
          node: rule,
          result,
          ruleName,
          index: nameIndex,
          endIndex: nameIndex + className.length,
        });
      }
    }
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = {
  url: "https://github.com/mittwald/flow/blob/main/packages/components/AGENTS.md#styling",
};

export default stylelint.createPlugin(ruleName, ruleFunction);
