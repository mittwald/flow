import {
  AlertBadge,
  Button,
  ColumnLayout,
  Content,
  CopyButton,
  Header,
  Heading,
  IconContextMenu,
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
      Mein Projekt
      <AlertBadge status="danger">
        Fehlende Vertragspartnerdaten
      </AlertBadge>
    </Heading>
    <Button
      variant="soft"
      color="secondary"
      aria-label="Weitere Aktionen anzeigen"
    >
      <IconContextMenu />
    </Button>
    <Button variant="soft" color="secondary">
      Datenbank migrieren
    </Button>
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
