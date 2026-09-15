import {
  Alert,
  Breadcrumb,
  Button,
  ColumnLayout,
  Content,
  Flex,
  Heading,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Flex direction="column" gap="m">
    <Flex direction="column">
      <Breadcrumb color="dark">
        <Link>Projekt</Link>
        <Link>E-Mail-Adressen</Link>
        <Link>max@mustermann.de</Link>
      </Breadcrumb>
      <Heading color="dark" level={1}>
        max@mustermann.de
      </Heading>
    </Flex>

    <Alert status="danger">
      <Heading>E-Mail-Empfang ist deaktiviert</Heading>
      <Content>
        Die MX-Records der Domain mustermann.de zeigen nicht
        auf unsere Mailserver. Eingehende E-Mails werden
        derzeit nicht zugestellt.
        <Button>MX-Records anpassen</Button>
      </Content>
    </Alert>

    <Alert status="warning">
      <Heading>
        Der Speicherplatz ist zu 92 % belegt
      </Heading>
      <Content>
        Ist der Speicher voll, werden eingehende E-Mails
        abgewiesen.
        <Button>Speicherplatz erweitern</Button>
      </Content>
    </Alert>

    <LayoutCard>
      <Section>
        <Heading>E-Mail-Adresse</Heading>
        <ColumnLayout m={[1, 1]}>
          <LabeledValue>
            <Label>E-Mail-Adresse</Label>
            <Text>max@mustermann.de</Text>
          </LabeledValue>
          <LabeledValue>
            <Label>Angelegt am</Label>
            <Text>14. Februar 2026</Text>
          </LabeledValue>
        </ColumnLayout>
      </Section>
    </LayoutCard>
  </Flex>
);
