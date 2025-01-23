import "./global.css";
import { type PropsWithChildren } from "react";
import { Root } from "@mittwald/flow-remote-react-components/Root";

export default function Page(props: PropsWithChildren) {
  return <Root>{props.children}</Root>;
}
