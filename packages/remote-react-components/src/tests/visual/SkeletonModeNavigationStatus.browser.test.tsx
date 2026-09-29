import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

/* The first published version with SkeletonMode — 1.4.0-next.9 is out without
   it. Pin to the real release once it is published. */
const skeletonModeSince = "1.4.0-next.10";

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode navigation (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      SkeletonMode,
      Section,
      ColumnLayout,
      Navigation,
      NavigationGroup,
      HeaderNavigation,
      TabNavigation,
      Breadcrumb,
      Tabs,
      Tab,
      TabTitle,
      Link,
      Label,
      Text,
    },
  }) => {
    await render(
      <SkeletonMode>
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
                    Der Projektname erscheint in der Projektübersicht und in
                    allen Rechnungen.
                  </Text>
                </Section>
              </Tab>
              <Tab id="backups">
                <TabTitle>Backups</TabTitle>
                <Section>
                  <Text>Backups werden jede Nacht erstellt.</Text>
                </Section>
              </Tab>
              <Tab id="access">
                <TabTitle>Zugänge</TabTitle>
                <Section>
                  <Text>SSH- und SFTP-Zugänge</Text>
                </Section>
              </Tab>
            </Tabs>
          </ColumnLayout>
        </Section>
      </SkeletonMode>,
    );

    await testScreenshot("SkeletonMode navigation");
  },
);

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode status (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      SkeletonMode,
      Section,
      ColumnLayout,
      Alert,
      AlertIcon,
      AlertText,
      Heading,
      Content,
      Text,
      Label,
      IllustratedMessage,
      MessageThread,
      Message,
      ProgressBar,
      Rating,
      LoadingSpinner,
    },
  }) => {
    await render(
      <SkeletonMode>
        <Section>
          <Alert status="danger">
            <Heading>Zertifikat abgelaufen</Heading>
            <Content>
              Die Domain webshop.example-domain.de ist nicht mehr per HTTPS
              erreichbar.
            </Content>
          </Alert>
          {/* No Notification: remotely, the host renders it as a toast in the
              NotificationProvider, outside the SkeletonMode tree. */}
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
                  <Text>
                    Die Wiederherstellung ist für heute Abend geplant.
                  </Text>
                </Content>
              </Message>
            </MessageThread>
          </ColumnLayout>
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
            <AlertText status="warning">
              Das Zertifikat läuft bald ab.
            </AlertText>
            <AlertIcon status="success" />
            <Rating aria-label="Bewertung" defaultValue={4} />
            <LoadingSpinner />
          </ColumnLayout>
        </Section>
      </SkeletonMode>,
    );

    await testScreenshot("SkeletonMode status");
  },
);
