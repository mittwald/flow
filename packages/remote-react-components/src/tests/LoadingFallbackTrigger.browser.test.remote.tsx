import { Section, Text } from "@/auto-generated";
import { LoadingFallbackTrigger } from "@/components";
import { useEffect, useState } from "react";

export const standard = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady((r) => !r);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isReady]);

  return (
    <Section>
      <LoadingFallbackTrigger show={!isReady} />
      <Text data-testid="content">Some content</Text>
    </Section>
  );
};
