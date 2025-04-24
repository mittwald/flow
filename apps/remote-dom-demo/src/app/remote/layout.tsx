import { NotificationProvider } from "@mittwald/flow-react-components";
import RemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import type { PropsWithChildren } from "react";

export default function RemoteLayout(props: PropsWithChildren) {
  return (
    <RemoteRoot>
      <NotificationProvider>{props.children}</NotificationProvider>
    </RemoteRoot>
  );
}
