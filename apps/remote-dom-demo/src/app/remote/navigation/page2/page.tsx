"use client";
import { Button, Section } from "@mittwald/flow-remote-react-components";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <Section>
      <Button onPress={() => router.push("/remote/navigation/page1")}>
        To Page 1
      </Button>
    </Section>
  );
}
