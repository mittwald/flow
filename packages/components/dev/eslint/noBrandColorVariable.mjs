import {
  findBrandColorVariables,
  hint,
} from "../brandColors/brandColorVariables.mjs";

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow Brand CSS variables (`--color--<brand-group>--…`) in code",
      url: "https://github.com/mittwald/flow/blob/main/docs/adr/0007-color-token-tiers.md",
    },
    schema: [],
    messages: {
      rejected: `Unexpected Brand CSS variable "{{name}}". ${hint}`,
      rejectedRuntime: `Unexpected "{{name}}" completed at runtime — it can only name a Brand CSS variable. ${hint}`,
    },
  },
  create(context) {
    // Any JS string may be concatenated, so a name that ends the string may
    // be completed at runtime.
    const check = (node, value) => {
      for (const { name, completedAtRuntime } of findBrandColorVariables(
        value,
        { openEnd: true },
      )) {
        context.report({
          node,
          messageId: completedAtRuntime ? "rejectedRuntime" : "rejected",
          data: { name },
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
