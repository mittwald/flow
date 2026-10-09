import type { Meta, StoryObj } from "@storybook/react";
import SkeletonMode from "../SkeletonMode";
import { Section } from "@/components/Section";
import { ColumnLayout } from "@/components/ColumnLayout";
import { Navigation, NavigationGroup } from "@/components/Navigation";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import { TabNavigation } from "@/components/TabNavigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { Link } from "@/components/Link";
import { Label } from "@/components/Label";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Content } from "@/components/Content";
import { Alert } from "@/components/Alert";
import { AlertIcon } from "@/components/AlertIcon";
import { AlertText } from "@/components/AlertText";
import { Notification } from "@/components/Notification";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { MessageThread } from "@/components/MessageThread";
import { Message } from "@/components/Message";
import { ProgressBar } from "@/components/ProgressBar";
import { Rating } from "@/components/Rating";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const meta: Meta<typeof SkeletonMode> = {
  title: "Content/SkeletonMode/NavigationStatus",
  component: SkeletonMode,
  args: {
    isEnabled: true,
  },
};

export default meta;

type Story = StoryObj<typeof SkeletonMode>;

export const NavigationComponents: Story = {
  render: (props) => (
    <SkeletonMode {...props}>
      <Section>
        <HeaderNavigation aria-label="Hauptnavigation">
          <Link href="#" aria-current="page">
            Projekte
          </Link>
          <Link href="#">Organisationen</Link>
          <Link href="#">Support</Link>
        </HeaderNavigation>
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
            <Link href="#">Apps</Link>
            <NavigationGroup>
              <Label>Hosting</Label>
              <Link href="#">Domains</Link>
              <Link href="#">Datenbanken</Link>
            </NavigationGroup>
          </Navigation>
          <Tabs aria-label="Einstellungen">
            <Tab id="general">
              <TabTitle>Allgemein</TabTitle>
              <Section>
                <Text>
                  Der Projektname erscheint in der Projektübersicht und in allen
                  Rechnungen.
                </Text>
              </Section>
            </Tab>
            <Tab id="backups">
              <TabTitle>Backups</TabTitle>
              <Section>
                <Text>Backups werden jede Nacht erstellt.</Text>
              </Section>
            </Tab>
          </Tabs>
        </ColumnLayout>
      </Section>
    </SkeletonMode>
  ),
};

export const StatusComponents: Story = {
  render: (props) => (
    <SkeletonMode {...props}>
      <Section>
        <Alert status="danger">
          <Heading>Zertifikat abgelaufen</Heading>
          <Content>
            Die Domain webshop.example-domain.de ist nicht mehr per HTTPS
            erreichbar.
          </Content>
        </Alert>
        <ColumnLayout m={[1, 1]}>
          <Notification status="success">
            <Heading>Backup erstellt</Heading>
            <Text>Das Backup von p-4711 steht zum Download bereit.</Text>
          </Notification>
          <IllustratedMessage color="danger">
            <AlertIcon status="danger" />
            <Heading>Keine Domains</Heading>
            <Text>Füge deine erste Domain hinzu.</Text>
          </IllustratedMessage>
        </ColumnLayout>
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
        <ProgressBar
          value={72}
          status="warning"
          segments={[
            { title: "Webspace", value: 40 },
            { title: "Datenbanken", value: 20 },
            { title: "E-Mail", value: 12 },
          ]}
        >
          <Label>Speicherplatz</Label>
        </ProgressBar>
        <ColumnLayout m={[1, 1, 1, 1]}>
          <AlertText status="warning">Das Zertifikat läuft bald ab.</AlertText>
          <AlertIcon status="success" />
          <Rating aria-label="Bewertung" defaultValue={4} />
          <LoadingSpinner />
        </ColumnLayout>
      </Section>
    </SkeletonMode>
  ),
};
