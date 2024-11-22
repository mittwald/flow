"use client";
import "@mittwald/flow-react-components/all.css";
import { FlowRemoteReactRenderer } from "@mittwald/flow-remote-react-renderer";

export default function Page() {
  return <FlowRemoteReactRenderer src="/remote" />;
}
