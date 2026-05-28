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
      <Title>Details</Title>
      <Actions>
        <MenuItem
          onAction={() => {
            console.log("Test");
          }}
        >
          Test
        </MenuItem>
        <MenuItem
          onAction={() => {
            console.log("Test");
          }}
        >
          Test
        </MenuItem>
      </Actions>
      <Breadcrumb>
        <Link href="/remote/navigation/subpage">Subpage</Link>
      </Breadcrumb>
      <Section>
        <Heading>Page 2</Heading>
        <Button
          isPending={isNavigating}
          onPress={() =>
            startNavigating(() => router.push("/remote/navigation"))
          }
        >
          To Page 1
        </Button>
        <Link href="/remote/navigation">To Page 1</Link>
      </Section>
    </>
  );
}
