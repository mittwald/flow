/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Button,
  CodeBlock,
  Section,
  TextField,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, ref } from "vue";

/**
 * The Vue counterpart of `/remote/event-handler`.
 *
 * The listeners are the interesting half: the host dispatches the event, the
 * payload travels back through the connection, and a plain Vue `ref` drives the
 * next render.
 */
export const EventHandlerDemo = defineComponent({
  name: "EventHandlerDemo",
  setup() {
    const event = ref<unknown>();

    return () => (
      <Section>
        <Button
          color="danger"
          variant="outline"
          onPress={(pressEvent: unknown) => (event.value = pressEvent)}
        >
          Fire proton torpedo
        </Button>
        <TextField
          aria-label="Mission name"
          onChange={(value: string) => (event.value = value)}
        />
        <CodeBlock code={JSON.stringify(event.value, undefined, 2)} />
      </Section>
    );
  },
});
