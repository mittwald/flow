import {
  Alert,
  Button,
  Heading,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";

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

    return () =>
      h(Section, null, () => [
        h(TextField, {
          "aria-label": "Number of fleet alerts",
          onChange: (value: string) =>
            (elementCount.value = Number.parseInt(value)),
        }),
        h(
          Button,
          { onPress: () => (showElements.value = !showElements.value) },
          () => "Toggle fleet alerts",
        ),
        ...(Number.isNaN(elementCount.value) || !showElements.value
          ? []
          : Array.from({ length: elementCount.value }, (_ignored, index) =>
              h(Alert, { key: index }, () => [
                h(Heading, null, () => "Fleet alert"),
                h(Text, null, () => `Battle report ${ticker.value}`),
              ]),
            )),
      ]);
  },
});
