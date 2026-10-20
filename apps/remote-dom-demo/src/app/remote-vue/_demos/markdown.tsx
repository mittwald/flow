/** @jsxImportSource @/app/remote-vue/_lib */
import { Markdown } from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

/** The Vue counterpart of `/remote/markdown`. */
export const MarkdownDemo = defineComponent({
  name: "MarkdownDemo",
  setup: () => () => (
    <Markdown>
      The **Death Star** is fully operational and moving toward the *Endor*
      system, guarded by the ***entire Imperial fleet***.
    </Markdown>
  ),
});
