"use client";
import { useConfig } from "@mittwald/ext-bridge/react";
import {
  BrowserOnly,
  CodeBlock,
  Section,
} from "@mittwald/flow-remote-react-components";

const BridgeInfo = () => {
  const config = useConfig();

  return <CodeBlock code={JSON.stringify(config)} />;
};

export default function Page() {
  return (
    <Section>
      <BrowserOnly>
        <BridgeInfo />
      </BrowserOnly>
    </Section>
  );
}
