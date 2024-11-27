"use client";
import { type PropsWithChildren } from "react";
import { Root } from "@mittwald/flow-remote-react-components";

export default function Page(props: PropsWithChildren) {
  return <Root>{props.children}</Root>;
}
