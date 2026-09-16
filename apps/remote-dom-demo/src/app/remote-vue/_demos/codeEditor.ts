import {
  ActionGroup,
  Button,
  CodeBlock,
  CodeEditor,
  Section,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h, ref } from "vue";

/**
 * The Vue counterpart of `/remote/code-editor`.
 *
 * The React page drives the editor through react-hook-form; here the value is a
 * `ref`, which is the part that matters across the boundary — every keystroke
 * is reported by the host and written back by the extension.
 */
export const CodeEditorDemo = defineComponent({
  name: "CodeEditorDemo",
  setup() {
    const code = ref("hyperdrive_class=1.0");
    const saved = ref<string>();

    return () =>
      h(Section, null, () => [
        h(CodeEditor, {
          language: "tsx",
          "aria-label": "Ship configuration",
          value: code.value,
          onChange: (value: string) => (code.value = value),
        }),
        h(ActionGroup, null, () =>
          h(
            Button,
            { onPress: () => (saved.value = code.value) },
            () => "Save configuration",
          ),
        ),
        h(CodeBlock, {
          code: JSON.stringify({ saved: saved.value }, undefined, 2),
        }),
      ]);
  },
});
