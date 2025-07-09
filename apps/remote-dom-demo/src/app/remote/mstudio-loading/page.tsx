"use client";

import { Heading, Section, Text } from "@mittwald/flow-remote-react-components";
import { LoadingIndicator } from "@mittwald/mstudio-ext-react-components";
import { useState } from "react";
import { useTimeout } from "usehooks-ts";

export default function Page() {
  const [loading, setIsLoading] = useState(true);
  const hideLoading = () => {
    setIsLoading(false);
  };
  useTimeout(hideLoading, 3000);
  console.log("Is loading?", loading);

  return (
    <Section>
      <Heading>Demo</Heading>
      <Text>Some text</Text>
      <LoadingIndicator show={loading} />
    </Section>
  );
}
