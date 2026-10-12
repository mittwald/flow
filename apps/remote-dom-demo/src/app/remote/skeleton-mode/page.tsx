"use client";
import {
  Content,
  Heading,
  InlineCode,
  Label,
  LabeledValue,
  Link,
  Section,
  SkeletonMode,
  Switch,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";
import { VisualDemo } from "./VisualDemo";

export default function Page() {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <Section>
      <Switch isSelected={isEnabled} onChange={setIsEnabled}>
        SkeletonMode
      </Switch>

      <SkeletonMode isEnabled={isEnabled}>
        <Section>
          <Heading>Webshop Relaunch</Heading>
          <Text>
            Das Projekt liegt auf dem Server <InlineCode>p-4711</InlineCode> und
            ist unter <Link href="#">webshop.example-domain.de</Link>{" "}
            erreichbar.
          </Text>
          <LabeledValue>
            <Label>Speicherplatz</Label>
            <Content>20 GB</Content>
          </LabeledValue>
          <Heading level={3} />
          <Text />
          <SkeletonMode isEnabled={false}>
            <Text>Dieser Text ist bereits geladen.</Text>
          </SkeletonMode>
          <VisualDemo />
        </Section>
      </SkeletonMode>
    </Section>
  );
}
