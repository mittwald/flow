import {
  ActionGroup,
  Button,
  ColumnLayout,
  Content,
  CopyButton,
  Header,
  Heading,
  Label,
  LabeledValue,
  LayoutCard,
  Modal,
  ModalTrigger,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <LayoutCard>
    <Section>
      <Header>
        <Heading>E-Mail-Adresse</Heading>
        <ActionGroup>
          <ModalTrigger>
            <Button variant="soft" color="secondary">
              Passwort ändern
            </Button>
            <Modal offCanvas>
              <Heading>Passwort ändern</Heading>
              <Content>
                <Text>…</Text>
              </Content>
            </Modal>
          </ModalTrigger>
          <ModalTrigger>
            <Button>Bearbeiten</Button>
            <Modal offCanvas>
              <Heading>E-Mail-Adresse bearbeiten</Heading>
              <Content>
                <Text>…</Text>
              </Content>
            </Modal>
          </ModalTrigger>
        </ActionGroup>
      </Header>

      <ColumnLayout m={[1, 1]}>
        <LabeledValue>
          <Label>E-Mail-Adresse</Label>
          <Text>max@mustermann.de</Text>
          <CopyButton value="max@mustermann.de" />
        </LabeledValue>
        <LabeledValue>
          <Label>Angelegt am</Label>
          <Text>14. Februar 2026</Text>
        </LabeledValue>
        <LabeledValue>
          <Label>Beschreibung</Label>
          <Text>Nicht gesetzt</Text>
        </LabeledValue>
        <LabeledValue>
          <Label>Spamschutz</Label>
          <Text>Aktiv</Text>
        </LabeledValue>
      </ColumnLayout>
    </Section>
  </LayoutCard>
);
