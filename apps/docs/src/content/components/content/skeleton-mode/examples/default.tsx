import {
  Content,
  Heading,
  Label,
  LabeledValue,
  Section,
  SkeletonMode,
  Switch,
  Text,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Section>
      <Switch
        isSelected={isLoading}
        onChange={setIsLoading}
      >
        Ladezustand anzeigen
      </Switch>
      <SkeletonMode isEnabled={isLoading}>
        <Section>
          <Heading>Webshop Relaunch</Heading>
          <Text>
            Das Projekt liegt auf dem Server p-4711 und wird
            jede Nacht gesichert.
          </Text>
          <LabeledValue>
            <Label>Speicherplatz</Label>
            <Content>20 GB</Content>
          </LabeledValue>
        </Section>
      </SkeletonMode>
    </Section>
  );
};
