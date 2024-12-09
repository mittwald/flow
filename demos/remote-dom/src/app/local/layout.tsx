"use client";
import "@mittwald/flow-react-components/all.css";
import { type PropsWithChildren } from "react";

export default function Page(props: PropsWithChildren) {
  return <>{props.children}</>;
}
