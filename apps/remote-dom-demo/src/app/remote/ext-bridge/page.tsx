"use client";
import { useExtBridge } from "@mittwald/ext-bridge/react";
import { CodeBlock, Section } from "@mittwald/flow-remote-react-components";

const BridgeInfo = () => {
  const bridge = useExtBridge();

  return <CodeBlock code={JSON.stringify(bridge.config)} />;
};

export default function Page() {
  return (
    <Section>
      <BridgeInfo />
    </Section>
  );
}
