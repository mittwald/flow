"use client";

import { Heading, Section, Text } from "@mittwald/flow-remote-react-components";
import { LoadingIndicator } from "@mittwald/mstudio-ext-react-components";
import { useEffect, useState } from "react";

export default function Page() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsReady((r) => {
        console.log("App is ready?", !r);
        return !r;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Section>
      <Heading>Demo</Heading>
      <Text>Some text</Text>
      <LoadingIndicator show={!isReady} />
    </Section>
  );
}
