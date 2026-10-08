import {
  Heading,
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
          <SkeletonMode isEnabled={false}>
            <Heading>Speicherplatz</Heading>
          </SkeletonMode>
          <Text>Belegt sind 12,4 GB von 20 GB.</Text>
        </Section>
      </SkeletonMode>
    </Section>
  );
};
