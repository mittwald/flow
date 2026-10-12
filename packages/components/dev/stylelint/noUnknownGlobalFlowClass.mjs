import stylelint from "stylelint";
import {
  knownFlowClasses,
  suggestionFor,
} from "../flowClassNames/knownFlowClasses.mjs";

const ruleName = "flow/no-unknown-global-flow-class";

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (className, suggestion) =>
    `Unexpected ":global(.${className})" — no Flow component generates that class, so the selector matches nothing. ${
      suggestion ? `Did you mean ".${suggestion}"? ` : ""
    }Generated names come from the component's path and drop the suffix when it equals the component name (dev/vite/cssModuleClassNameGenerator.ts), so they cannot be derived by hand — copy the name from the component's *.module.d.scss.ts. If you just added the class, regenerate the stubs first: pnpm nx build:scss-types components.`,
});

const ruleFunction = (primary) => (root, result) => {
  if (
    !stylelint.utils.validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    })
  ) {
    return;
  }

  const knownClasses = knownFlowClasses();

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
