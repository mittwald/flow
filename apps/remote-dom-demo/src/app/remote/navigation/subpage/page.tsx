"use client";
import {
  Button,
  Heading,
  Link,
  MenuItem,
  Section,
} from "@mittwald/flow-remote-react-components";
import {
  Actions,
  Breadcrumb,
  Title,
} from "@mittwald/mstudio-ext-react-components";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Page() {
  const router = useRouter();
  const [isNavigating, startNavigating] = useTransition();
  return (
    <>
      <Title>Battle station</Title>
      <Actions>
        <MenuItem
          onAction={() => {
            console.log("Rename station");
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onAction={() => {
            console.log("Decommission station");
          }}
        >
          Decommission
        </MenuItem>
      </Actions>
      <Breadcrumb>
        <Link href="/remote/navigation/subpage">Battle station</Link>
      </Breadcrumb>
      <Section>
        <Heading>Death Star</Heading>
        <Button
          isPending={isNavigating}
          onPress={() =>
            startNavigating(() => router.push("/remote/navigation"))
          }
        >
          Back to fleet
        </Button>
        <Link href="/remote/navigation">Back to fleet</Link>
      </Section>
    </>
  );
}
