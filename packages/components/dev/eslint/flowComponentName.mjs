/**
 * `flowComponent("<Name>", …)` registers the component under that name. The
 * name is what a `PropsContext` key, the props-type registry
 * (`src/components/propTypes/index.ts`) and the generated remote element all
 * refer to, so it has to be the component's own name — the convention is that
 * it matches the file (and therefore the directory) it lives in.
 *
 * A mismatch typechecks: the name only has to be _some_ key of
 * `FlowComponentPropsTypes`, so a copy-paste registers the new component under
 * an existing component's name and it silently picks up that component's props
 * context instead of its own.
 */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require the name passed to flowComponent() to match the file name.",
    },
    schema: [],
    messages: {
      mismatch:
        'flowComponent("{{registered}}") lives in {{file}}.tsx. The registered name is what PropsContext keys, the props-type registry and the generated remote element refer to — name it "{{expected}}", or move it into {{registered}}.tsx.',
    },
  },
  create(context) {
    const expected = context.filename
      .replaceAll("\\", "/")
      .split("/")
      .pop()
      .replace(/\.tsx?$/, "");

    return {
      CallExpression(node) {
        if (node.callee.type !== "Identifier") {
          return;
        }
        if (node.callee.name !== "flowComponent") {
          return;
        }

        const [name] = node.arguments;
        if (name?.type !== "Literal" || typeof name.value !== "string") {
          return;
        }
        if (name.value === expected) {
          return;
        }

        context.report({
          node: name,
          messageId: "mismatch",
          data: { registered: name.value, expected, file: expected },
        });
      },
    };
  },
};

export default rule;
