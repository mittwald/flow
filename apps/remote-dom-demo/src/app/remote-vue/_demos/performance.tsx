/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Alert,
  Button,
  Heading,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";

/**
 * The Vue counterpart of `/remote/performance`.
 *
 * Every tick changes a prop on every alert, so the number in the field is the
 * number of remote properties that cross the boundary twice a second.
 */
export const PerformanceDemo = defineComponent({
  name: "PerformanceDemo",
  setup() {
    const elementCount = ref(100);
    const showElements = ref(true);
    const ticker = ref(0);

    let interval: ReturnType<typeof setInterval> | undefined;
    onMounted(() => {
      interval = setInterval(() => ticker.value++, 500);
    });
    onBeforeUnmount(() => clearInterval(interval));

    return () => (
      <Section>
        <TextField
          aria-label="Number of fleet alerts"
          onChange={(value: string) =>
            (elementCount.value = Number.parseInt(value))
          }
        />
        <Button onPress={() => (showElements.value = !showElements.value)}>
          Toggle fleet alerts
        </Button>
        {Number.isNaN(elementCount.value) || !showElements.value
          ? []
          : Array.from({ length: elementCount.value }, (_ignored, index) => (
              <Alert key={index}>
                <Heading>Fleet alert</Heading>
                <Text>Battle report {ticker.value}</Text>
              </Alert>
            ))}
      </Section>
    );
  },
});
