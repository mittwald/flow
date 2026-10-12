import {
  knownFlowClasses,
  suggestionFor,
} from "../flowClassNames/knownFlowClasses.mjs";

const flowClassPattern = /(?<![\w-])flow--[\w-]+/g;

/**
 * A prefix completed at runtime: it ends in a dash, which no generated name
 * does, or an interpolation continues it.
 */
const isPrefix = (node, value, match) =>
  match[0].endsWith("-") ||
  (node.type === "TemplateElement" &&
    !node.tail &&
    match.index + match[0].length === value.length);

/** Every start of a known class that ends at a dash, plus the classes. */
const prefixesOf = (known) => {
  const prefixes = new Set(known);

  for (const className of known) {
    for (let i = 0; i < className.length; i++) {
      if (className[i] === "-") {
        prefixes.add(className.slice(0, i + 1));
      }
    }
  }

  return prefixes;
};

const hint =
  "Generated names come from the component's path and drop the suffix when it equals the component name (dev/vite/cssModuleClassNameGenerator.ts), so they cannot be derived by hand — copy the name from the component's *.module.d.scss.ts. If you just added the class, regenerate the stubs first: pnpm nx build:scss-types components.";

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow hardcoded `flow--…` class names that no Flow component generates",
      url: "https://github.com/mittwald/flow/blob/main/packages/components/AGENTS.md#styling",
    },
    schema: [],
    messages: {
      rejected: `Unexpected "{{className}}" — no Flow component generates that class, so nothing it selects or sets will ever match. {{suggestion}}${hint}`,
      rejectedPrefix: `Unexpected "{{className}}" — no Flow component generates a class starting with it, so the name completed at runtime will never match. {{suggestion}}${hint}`,
    },
  },
  create(context) {
    const knownClasses = knownFlowClasses();

    const check = (node, value) => {
      for (const match of value.matchAll(flowClassPattern)) {
        const className = match[0];

        if (knownClasses.has(className)) {
          continue;
        }

        const prefix = isPrefix(node, value, match);

        if (
          prefix &&
          knownClasses.values().some((known) => known.startsWith(className))
        ) {
          continue;
        }

        const suggestion = suggestionFor(
          className,
          prefix ? prefixesOf(knownClasses) : knownClasses,
        );

        context.report({
          node,
          messageId: prefix ? "rejectedPrefix" : "rejected",
          data: {
            className,
            suggestion: suggestion ? `Did you mean "${suggestion}"? ` : "",
          },
        });
      }
    };

    return {
      Literal(node) {
        if (typeof node.value === "string") {
          check(node, node.value);
        }
      },
      TemplateElement(node) {
        // `cooked` is null for an invalid escape in a tagged template.
        if (node.value.cooked !== null) {
          check(node, node.value.cooked);
        }
      },
    };
  },
};
