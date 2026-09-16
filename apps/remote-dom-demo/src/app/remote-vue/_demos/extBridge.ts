import { CodeBlock, Section } from "@mittwald/flow-remote-vue-components";
import { getConfig } from "@mittwald/ext-bridge/browser";
import { defineComponent, h, onMounted, ref } from "vue";

/**
 * The Vue counterpart of `/remote/ext-bridge`.
 *
 * Ext-bridge itself is framework-agnostic — only its `useConfig` hook is React.
 * `getConfig()` is the same call without one.
 */
export const ExtBridgeDemo = defineComponent({
  name: "ExtBridgeDemo",
  setup() {
    const config = ref<unknown>();

    onMounted(() => {
      void getConfig().then((value) => (config.value = value));
    });

    return () =>
      h(Section, null, () =>
        h(CodeBlock, { code: JSON.stringify(config.value, undefined, 2) }),
      );
  },
});
