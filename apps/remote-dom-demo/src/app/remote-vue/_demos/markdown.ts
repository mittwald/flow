import { Markdown } from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

/** The Vue counterpart of `/remote/markdown`. */
export const MarkdownDemo = defineComponent({
  name: "MarkdownDemo",
  setup: () => () =>
    h(
      Markdown,
      null,
      () =>
        "The **Death Star** is fully operational and moving toward the *Endor* system, guarded by the ***entire Imperial fleet***.",
    ),
});
