import {
  Action,
  ActionGroup,
  Button,
  ColumnLayout,
  Content,
  FieldDescription,
  Header,
  Heading,
  InlineCode,
  Label,
  Modal,
  ModalTrigger,
  Option,
  PasswordCreationField,
  Section,
  Select,
  TextField,
} from "@mittwald/flow-react-components";

<ModalTrigger>
  <Button color="accent">Beispiel öffnen</Button>
  <Modal offCanvas>
    <Heading>WordPress anlegen</Heading>
    <Content>
      <Section>
        <ColumnLayout m={[2, 1]}>
          <TextField isRequired>
            <Label>Name</Label>
          </TextField>
          <Select isRequired defaultSelectedKey="6.5.3">
            <Label>Version</Label>
            <Option value="6.5.3">6.5.3 (Neueste)</Option>
            <Option value="6.5.2">6.5.2</Option>
            <Option value="6.5.1">6.5.1</Option>
          </Select>
        </ColumnLayout>
        <TextField isRequired>
          <Label>Installationsverzeichnis</Label>
          <FieldDescription>
            Deine App wird unter{" "}
            <InlineCode>{`/html/<installationsverzeichnis>`}</InlineCode>{" "}
            installiert
          </FieldDescription>
        </TextField>
        <Header>
          <Heading>Hauptdomain zuweisen</Heading>
          <Button color="accent">Subdomain anlegen</Button>
        </Header>
        <Select isRequired placeholder="Domain wählen">
          <Label>Domain</Label>
          <Option>meine-domain.de</Option>
          <Option>noch-eine-domain.de</Option>
        </Select>
        <Heading>Admin anlegen</Heading>
        <TextField isRequired defaultValue="WordPress">
          <Label>E-Mail-Adresse</Label>
        </TextField>
        <TextField
          isRequired
          defaultValue="meinname@meinedomain.de"
        >
          <Label>Benutzername</Label>
        </TextField>
        <PasswordCreationField isRequired>
          <Label>Passwort</Label>
        </PasswordCreationField>
      </Section>
    </Content>
    <ActionGroup>
      <Button color="accent">Anlegen</Button>
      <Button
        slot="secondary"
        color="secondary"
        variant="soft"
      >
        Zurück
      </Button>
      <Action closeOverlay="Modal">
        <Button color="secondary" variant="soft">
          Abbrechen
        </Button>
      </Action>
    </ActionGroup>
  </Modal>
</ModalTrigger>;
