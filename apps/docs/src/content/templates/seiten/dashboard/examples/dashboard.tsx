import {
  Button,
  ColumnLayout,
  Content,
  Flex,
  Header,
  Heading,
  IconEmail,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  ProgressBar,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Flex direction="column" gap="m">
    <Heading color="dark" level={1}>
      Projekt „Mustermann“
    </Heading>

    <ColumnLayout l={[2, 1]} m={[1]}>
      <Flex direction="column" gap="m">
        <LayoutCard>
          <Section>
            <Header>
              <Heading>Projekt</Heading>
              <Link href="#">Zu den Einstellungen</Link>
            </Header>
            <ColumnLayout m={[1, 1]}>
              <LabeledValue>
                <Label>Kurz-ID</Label>
                <Text>p-a1b2c3</Text>
              </LabeledValue>
              <LabeledValue>
                <Label>Server</Label>
                <Text>mittwald Space Server</Text>
              </LabeledValue>
            </ColumnLayout>
          </Section>
        </LayoutCard>

        <LayoutCard>
          <Section>
            <Header>
              <Heading>E-Mail-Adressen</Heading>
              <Link href="#">Alle anzeigen</Link>
            </Header>
            <Content>
              <Flex direction="row" gap="s" align="center">
                <IconEmail />
                <Text>
                  3 E-Mail-Adressen in diesem Projekt
                </Text>
              </Flex>
            </Content>
            <Button variant="soft" color="secondary">
              E-Mail-Adresse anlegen
            </Button>
          </Section>
        </LayoutCard>
      </Flex>

      <Flex direction="column" gap="m">
        <LayoutCard>
          <Section>
            <Header>
              <Heading>Speicherplatz</Heading>
              <Link href="#">Details</Link>
            </Header>
            <ProgressBar
              formatOptions={{
                style: "unit",
                unit: "gigabyte",
              }}
              showMaxValue
              maxValue={25}
              value={8.4}
              status="success"
            >
              <Label>Belegt</Label>
            </ProgressBar>
          </Section>
        </LayoutCard>

        <LayoutCard>
          <Section>
            <Header>
              <Heading>Erste Schritte</Heading>
            </Header>
            <Content>
              <Text>
                Richte deine erste App ein und verbinde eine
                Domain damit.
              </Text>
            </Content>
            <Button variant="soft" color="secondary">
              App installieren
            </Button>
          </Section>
        </LayoutCard>
      </Flex>
    </ColumnLayout>
  </Flex>
);
