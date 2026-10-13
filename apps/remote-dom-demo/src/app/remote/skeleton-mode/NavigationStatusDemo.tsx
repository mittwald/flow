"use client";
import {
  Alert,
  AlertIcon,
  AlertText,
  Breadcrumb,
  ColumnLayout,
  Content,
  Heading,
  IllustratedMessage,
  Label,
  Link,
  LoadingSpinner,
  Message,
  MessageThread,
  Navigation,
  NavigationGroup,
  ProgressBar,
  Rating,
  Section,
  Tab,
  TabNavigation,
  Tabs,
  TabTitle,
  Text,
} from "@mittwald/flow-remote-react-components";

export const NavigationStatusDemo = () => (
  <Section>
    <Breadcrumb>
      <Link href="#">Projekte</Link>
      <Link href="#">Webshop Relaunch</Link>
      <Link href="#">Domains</Link>
    </Breadcrumb>
    <TabNavigation aria-label="Projekt">
      <Link href="#" aria-current="page">
        Übersicht
      </Link>
      <Link href="#">Domains</Link>
      <Link href="#">Backups</Link>
    </TabNavigation>
    <ColumnLayout m={[1, 2]}>
      <Navigation aria-label="Projekt">
        <Link href="#" aria-current="page">
          Übersicht
        </Link>
        <NavigationGroup>
          <Label>Hosting</Label>
          <Link href="#">Domains</Link>
          <Link href="#">Datenbanken</Link>
        </NavigationGroup>
      </Navigation>
      <Tabs aria-label="Einstellungen">
        <Tab id="general">
          <TabTitle>Allgemein</TabTitle>
          <Text>Der Projektname erscheint in allen Rechnungen.</Text>
        </Tab>
        <Tab id="backups">
          <TabTitle>Backups</TabTitle>
          <Text>Backups werden jede Nacht erstellt.</Text>
        </Tab>
      </Tabs>
    </ColumnLayout>
    <Alert status="danger">
      <Heading>Zertifikat abgelaufen</Heading>
      <Content>
        Die Domain webshop.example-domain.de ist nicht mehr per HTTPS
        erreichbar.
      </Content>
    </Alert>
    <ColumnLayout m={[1, 1]}>
      <IllustratedMessage color="danger">
        <AlertIcon status="danger" />
        <Heading>Keine Domains</Heading>
        <Text>Füge deine erste Domain hinzu.</Text>
      </IllustratedMessage>
      <MessageThread>
        <Message type="sender">
          <Content>Wann wird das Backup wiederhergestellt?</Content>
        </Message>
        <Message>
          <Content>
            <Text>Die Wiederherstellung ist für heute Abend geplant.</Text>
          </Content>
        </Message>
      </MessageThread>
    </ColumnLayout>
    <ProgressBar value={72} status="warning">
      <Label>Speicherplatz</Label>
    </ProgressBar>
    <ColumnLayout m={[1, 1, 1, 1]}>
      <AlertText status="warning">Das Zertifikat läuft bald ab.</AlertText>
      <AlertIcon status="success" />
      <Rating aria-label="Bewertung" defaultValue={4} />
      <LoadingSpinner />
    </ColumnLayout>
  </Section>
);
