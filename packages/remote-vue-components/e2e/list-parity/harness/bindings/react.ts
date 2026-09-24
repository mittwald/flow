import type { ParityBinding } from "../types";
import { NotificationProvider } from "@mittwald/flow-remote-react-components";
import RemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import { createElement, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

/** The reference binding: what every other one is compared against. */
export const reactBinding: ParityBinding = {
  name: "react",

  mount: (tree, container, receiver) => {
    createRoot(container).render(
      createElement(
        RemoteRoot,
        { __remoteReceiver: receiver as never },
        createElement(NotificationProvider, null, (tree as () => ReactNode)()),
      ),
    );
  },
};
