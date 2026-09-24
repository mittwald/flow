/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Button,
  Popover,
  PopoverTrigger,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

/** The Vue counterpart of `/remote/popover`. */
export const PopoverDemo = defineComponent({
  name: "PopoverDemo",
  setup: () => () => (
    <Section>
      <PopoverTrigger>
        <Button>Show battle station status</Button>
        <Popover>
          <Text>The Death Star is fully operational.</Text>
        </Popover>
      </PopoverTrigger>
    </Section>
  ),
});
