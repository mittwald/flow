import {
  Button,
  Heading,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h, ref, Suspense } from "vue";

const contact = (sleepMs: number) =>
  new Promise<number>((resolve) => setTimeout(() => resolve(sleepMs), sleepMs));

interface OutpostProps {
  label: string;
  sleepMs: number;
}

/**
 * Suspends until the outpost answers. Vue's `<Suspense>` waits for an async
 * `setup`, the way React's waits for a thrown promise.
 */
const Outpost = defineComponent({
  name: "Outpost",
  props: {
    label: { type: String, required: true },
    sleepMs: { type: Number, required: true },
  },
  async setup(props: OutpostProps) {
    const value = ref(await contact(props.sleepMs));
    const pings = ref(0);
    const isReconnecting = ref(false);

    const reconnect = async () => {
      isReconnecting.value = true;
      value.value = await contact(props.sleepMs);
      isReconnecting.value = false;
    };

    return () =>
      h(Section, null, () => [
        h(Heading, null, () => props.label),
        h(Text, null, () => `Reached in ${value.value} ms`),
        h(
          Button,
          { isPending: isReconnecting.value, onPress: () => void reconnect() },
          () => "Reconnect",
        ),
        h(
          Button,
          { color: "secondary", variant: "soft", onPress: () => pings.value++ },
          () => h(Text, null, () => `Pinged ${pings.value}x`),
        ),
        h(TextField, { "aria-label": "Outpost name" }),
      ]);
  },
});

const suspended = (label: string, sleepMs: number) =>
  h(Suspense, null, {
    default: () => h(Outpost, { label, sleepMs }),
    fallback: () => h(Heading, null, () => `Contacting ${label}…`),
  });

/**
 * The Vue counterpart of `/remote/suspense`.
 *
 * The fallback is a remote tree too, so the host renders it — the loading state
 * crosses the boundary like everything else, and the swap is one more mutation
 * batch.
 */
export const SuspenseDemo = defineComponent({
  name: "SuspenseDemo",
  setup: () => () => [
    suspended("Tatooine outpost", 1500),
    suspended("Hoth outpost", 1100),
    suspended("Endor outpost", 1700),
  ],
});
