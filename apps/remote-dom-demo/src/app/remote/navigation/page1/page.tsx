"use client";
import {
  Button,
  Heading,
  Section,
} from "@mittwald/flow-remote-react-components";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Page() {
  const router = useRouter();
  const [isNavigating, startNavigating] = useTransition();
  return (
    <Section>
      <Heading>Page 1</Heading>
      <Button
        isPending={isNavigating}
        onPress={() =>
          startNavigating(() => router.push("/remote/navigation/page2"))
        }
      >
        To Page 2
      </Button>
    </Section>
  );
}
