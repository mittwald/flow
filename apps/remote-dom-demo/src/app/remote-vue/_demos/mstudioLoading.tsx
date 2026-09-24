/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Heading,
  LoadingIndicator,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";

/** The Vue counterpart of `/remote/mstudio-loading`. */
export const MStudioLoadingDemo = defineComponent({
  name: "MStudioLoadingDemo",
  setup() {
    const isReady = ref(false);
    let interval: ReturnType<typeof setInterval> | undefined;

    onMounted(() => {
      interval = setInterval(() => {
        isReady.value = !isReady.value;
        console.log("App is ready?", isReady.value);
      }, 5000);
    });
    onBeforeUnmount(() => clearInterval(interval));

    return () => (
      <Section>
        <Heading>Death Star</Heading>
        <Text>Loading the command console…</Text>
        <LoadingIndicator show={!isReady.value} />
      </Section>
    );
  },
});
