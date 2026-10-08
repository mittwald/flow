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
          <Heading>webshop.example-domain.de</Heading>
          <Text>Subdomain</Text>
          <Heading />
          <Text />
        </Section>
      </SkeletonMode>
    </Section>
  );
};
