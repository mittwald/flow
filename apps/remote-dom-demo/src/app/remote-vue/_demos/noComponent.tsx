/** @jsxImportSource @/app/remote-vue/_lib */
import { Button, Section, Text } from "@mittwald/flow-remote-vue-components";
import { defineComponent, ref } from "vue";

/** The Vue counterpart of `/remote/no-component`. */
export const NoComponentDemo = defineComponent({
  name: "NoComponentDemo",
  setup() {
    const renderUnknown = ref(false);

    return () => (
      <Section>
        <Text>
          Renders a remote element with a tag the host cannot map, triggering
          the "No component found for remote element" error. The host holds the
          error back until it has been delivered to the remote, then re-throws
          it. The error therefore surfaces on both sides.
        </Text>
        {renderUnknown.value ? (
          <flr-unknown-component>unknown component</flr-unknown-component>
        ) : undefined}
        <Button color="danger" onPress={() => (renderUnknown.value = true)}>
          Render unknown component
        </Button>
      </Section>
    );
  },
});
