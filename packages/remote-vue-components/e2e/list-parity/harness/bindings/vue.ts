import type { ParityBinding } from "../types";
import RemoteRoot from "@mittwald/flow-remote-vue-components/RemoteRoot";
import { createApp, h, type VNodeChild } from "vue";

export const vueBinding: ParityBinding = {
  name: "vue",

  mount: (tree, container, receiver) => {
    createApp({
      render: () =>
        h(
          RemoteRoot,
          { __remoteReceiver: receiver as never },
          { default: tree as () => VNodeChild },
        ),
    }).mount(container);
  },
};
