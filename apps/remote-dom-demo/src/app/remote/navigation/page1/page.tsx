"use client";
import {
  Button,
  Heading,
  Section,
} from "@mittwald/flow-remote-react-components";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <Section>
      <Heading>Page 1</Heading>
      <Button onPress={() => router.push("/remote/navigation/page2")}>
        To Page 2
      </Button>
    </Section>
  );
}
