import {
  Alert,
  Content,
  Heading,
  Label,
  Link,
  ProgressBar,
  Section,
  SkeletonMode,
  Switch,
  Tab,
  TabNavigation,
  Tabs,
  TabTitle,
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
          <TabNavigation aria-label="Projekt">
            <Link href="#" aria-current="page">
              Übersicht
            </Link>
            <Link href="#">Domains</Link>
            <Link href="#">Backups</Link>
          </TabNavigation>
          <Alert status="danger">
            <Heading>Zertifikat abgelaufen</Heading>
            <Content>
              Die Domain webshop.example-domain.de ist nicht
              mehr per HTTPS erreichbar.
            </Content>
          </Alert>
          <ProgressBar value={72} status="warning">
            <Label>Speicherplatz</Label>
          </ProgressBar>
          <Tabs aria-label="Einstellungen">
            <Tab id="general">
              <TabTitle>Allgemein</TabTitle>
              <Text>
                Der Projektname erscheint in allen
                Rechnungen.
              </Text>
            </Tab>
            <Tab id="backups">
              <TabTitle>Backups</TabTitle>
              <Text>
                Backups werden jede Nacht erstellt.
              </Text>
            </Tab>
          </Tabs>
        </Section>
      </SkeletonMode>
    </Section>
  );
};
