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
      <Heading>Page 2</Heading>
      <Button onPress={() => router.push("/remote/navigation/page1")}>
        To Page 1
      </Button>
    </Section>
  );
}
