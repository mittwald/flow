import stylelint from "stylelint";
import {
  findBrandColorVariables,
  hint,
} from "../brandColors/brandColorVariables.mjs";

const ruleName = "flow/no-brand-color-variable";

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (name) => `Unexpected Brand CSS variable "${name}". ${hint}`,
  rejectedRuntime: (name) =>
    `Unexpected "${name}" completed at runtime — it can only name a Brand CSS variable. ${hint}`,
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

  const report = (node, text, offset) => {
    for (const { name, index, completedAtRuntime } of findBrandColorVariables(
      text,
    )) {
      stylelint.utils.report({
        message: completedAtRuntime
          ? messages.rejectedRuntime(name)
          : messages.rejected(name),
        node,
        result,
        ruleName,
        index: offset + index,
        endIndex: offset + index + name.length,
      });
    }
  };

  // A declaration both reads (`var(--color--…)`) and defines
  // (`--color--…: …`, which overrides the palette for a subtree).
  root.walkDecls((decl) => {
    report(decl, decl.prop, 0);
    report(
      decl,
      decl.raws.value?.raw ?? decl.value,
      decl.prop.length + (decl.raws.between ?? ":").length,
    );
  });

  root.walkAtRules((atRule) => {
    report(
      atRule,
      atRule.params,
      `@${atRule.name}`.length + (atRule.raws.afterName?.length ?? 0),
    );
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = {
  url: "https://github.com/mittwald/flow/blob/main/docs/adr/0007-color-token-tiers.md",
};

export default stylelint.createPlugin(ruleName, ruleFunction);
