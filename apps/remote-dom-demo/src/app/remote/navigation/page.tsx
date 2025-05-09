"use client";
import {
  Button,
  Heading,
  LayoutCard,
  Section,
} from "@mittwald/flow-remote-react-components";
import { Title } from "@mittwald/mstudio-ext-react-components";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Page() {
  const router = useRouter();
  const [isNavigating, startNavigating] = useTransition();
  return (
    <LayoutCard>
      <Title>Passwortschutz</Title>
      <Section>
        <Heading>Page 1</Heading>
        <Button
          isPending={isNavigating}
          onPress={() =>
            startNavigating(() => router.push("/remote/navigation/subpage"))
          }
        >
          To Page 2
        </Button>
      </Section>
    </LayoutCard>
  );
}
