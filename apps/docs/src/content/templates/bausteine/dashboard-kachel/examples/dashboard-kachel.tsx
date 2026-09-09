import {
  Button,
  ColumnLayout,
  Content,
  Header,
  Heading,
  Label,
  LayoutCard,
  Link,
  ProgressBar,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <ColumnLayout m={[1, 1]}>
    <LayoutCard>
      <Section>
        <Header>
          <Heading>E-Mail-Adressen</Heading>
          <Link href="#">Alle anzeigen</Link>
        </Header>
        <Content>
          <Text>
            3 E-Mail-Adressen, davon eine noch nicht
            verifiziert.
          </Text>
        </Content>
        <Button variant="soft" color="secondary">
          E-Mail-Adresse anlegen
        </Button>
      </Section>
    </LayoutCard>

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
  </ColumnLayout>
);
