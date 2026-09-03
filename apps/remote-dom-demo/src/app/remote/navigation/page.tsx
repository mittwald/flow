"use client";
import {
  Button,
  Heading,
  Section,
} from "@mittwald/flow-remote-react-components";
import { Title } from "@mittwald/mstudio-ext-react-components";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Page() {
  const router = useRouter();
  const [isNavigating, startNavigating] = useTransition();
  return (
    <>
      <Title>Fleet</Title>
      <Section>
        <Heading>Fleet</Heading>
        <Button
          isPending={isNavigating}
          onPress={() =>
            startNavigating(() => router.push("/remote/navigation/subpage"))
          }
        >
          Open Death Star
        </Button>
      </Section>
    </>
  );
}
