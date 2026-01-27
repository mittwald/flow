import {
  Button,
  ColumnLayout,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  CopyButton,
  Header,
  Heading,
  IconContextMenu,
  IconExternalLink,
  Label,
  LabeledValue,
  Link,
  MenuItem,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<Section>
  <Header>
    <Heading>Mein Projekt</Heading>

    <ContextMenuTrigger>
      <Button
        variant="soft"
        color="secondary"
        aria-label="Weitere Aktionen anzeigen"
      >
        <IconContextMenu />
      </Button>
      <ContextMenu aria-label="Weitere Aktionen">
        <MenuItem>Datenbank migrieren</MenuItem>
        <MenuItem>Volume migrieren</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>

    <Button color="danger">Deaktivieren</Button>
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
