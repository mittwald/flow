import {
  AlertBadge,
  Button,
  ColumnLayout,
  Content,
  CopyButton,
  Header,
  Heading,
  IconExternalLink,
  Label,
  LabeledValue,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<Section>
  <Header>
    <Heading>
      Mein sehr langes Projekt
      <AlertBadge status="danger">Deaktiviert</AlertBadge>
    </Heading>

    <Button variant="soft" color="secondary">
      Datenbank migrieren
    </Button>
    <Button color="accent">Aktivieren</Button>
  </Header>

  <ColumnLayout>
    <LabeledValue>
      <Label>Projektname</Label>
      <Content>Dolce Vita</Content>
    </LabeledValue>
    <LabeledValue>
      <Label>Short-ID</Label>
      <Content>p-lol3qe</Content>
      <CopyButton text="p-lol3qe" />
    </LabeledValue>
    <LabeledValue>
      <Label>Projektdomain</Label>
      <Link>
        <Text>p-lol3qe.project.space</Text>
        <IconExternalLink />
      </Link>
      <CopyButton text="p-lol3qe.project.space" />
    </LabeledValue>
  </ColumnLayout>
</Section>;
