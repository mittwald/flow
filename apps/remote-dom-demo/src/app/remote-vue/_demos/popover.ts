import {
  Button,
  Popover,
  PopoverTrigger,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

/** The Vue counterpart of `/remote/popover`. */
export const PopoverDemo = defineComponent({
  name: "PopoverDemo",
  setup: () => () =>
    h(Section, null, () =>
      h(PopoverTrigger, null, () => [
        h(Button, null, () => "Show battle station status"),
        h(Popover, null, () =>
          h(Text, null, () => "The Death Star is fully operational."),
        ),
      ]),
    ),
});
