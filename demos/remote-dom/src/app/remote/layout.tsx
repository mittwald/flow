"use client";
import { type PropsWithChildren } from "react";
import { FlowRemoteReactProvider } from "@mittwald/flow-remote-react-components";

export default function Page(props: PropsWithChildren) {
  return <FlowRemoteReactProvider>{props.children}</FlowRemoteReactProvider>;
}
