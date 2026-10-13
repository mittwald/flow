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
  const domain = {
    hostname: "webshop.example-domain.de",
    type: "Subdomain",
    project: "Webshop Relaunch",
    createdAt: "Angelegt am 12.03.2025",
  };

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
          {/* Platzhalter-Inhalt bestimmt die Breite */}
          <Heading>
            {isLoading
              ? "example-domain.de"
              : domain.hostname}
          </Heading>
          <Text>
            {isLoading ? "Subdomain" : domain.type}
          </Text>
          {/* Ohne Inhalt: Standardbreite */}
          <Heading>
            {isLoading ? null : domain.project}
          </Heading>
          <Text>{isLoading ? null : domain.createdAt}</Text>
        </Section>
      </SkeletonMode>
    </Section>
  );
};
