import { Button, Section } from "@mittwald/flow-remote-vue-components";
import { defineComponent, h, ref } from "vue";

const Thrower = defineComponent({
  name: "Thrower",
  setup: () => () => {
    throw new Error("Hyperdrive malfunction on the Millennium Falcon");
  },
});

/**
 * The Vue counterpart of `/remote/error`.
 *
 * `RemoteRoot` catches the render error with `onErrorCaptured` and reports the
 * message to the host, which shows its own failure state — the same contract
 * React's error boundary fulfils there.
 */
export const ErrorDemo = defineComponent({
  name: "ErrorDemo",
  setup() {
    const throwOnRender = ref(false);

    return () =>
      h(Section, null, () => [
        throwOnRender.value ? h(Thrower) : undefined,
        h(
          Button,
          { color: "danger", onPress: () => (throwOnRender.value = true) },
          () => "Engage hyperdrive",
        ),
      ]);
  },
});
