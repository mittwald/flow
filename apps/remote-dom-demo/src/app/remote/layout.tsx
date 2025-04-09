import RemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import type { PropsWithChildren } from "react";

export default function RemoteLayout(props: PropsWithChildren) {
  return <RemoteRoot>{props.children}</RemoteRoot>;
}
