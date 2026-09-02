import {
  ActionGroup,
  Button,
  ColumnLayout,
  Content,
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
        <Heading>Projektdetails</Heading>
        <ActionGroup>
          <Button variant="soft" color="secondary">
            Umbenennen
          </Button>
          <Button variant="soft" color="secondary">
            Bild bearbeiten
          </Button>
        </ActionGroup>
      </Header>
      <Text>
        Durch die Vergabe eines individuellen Namens findest
        du dein Projekt im mStudio leicht wieder.
      </Text>
      <ColumnLayout m={[1, 1]}>
        <LabeledValue>
          <Label>Projektname</Label>
          <Text>Bäckerei</Text>
        </LabeledValue>
      </ColumnLayout>
    </Section>

    <Section>
      <Header>
        <Heading>Projekt löschen</Heading>
        <ModalTrigger>
          <Button variant="soft" color="danger">
            Löschen
          </Button>
          <Modal>
            <Heading>Projekt löschen</Heading>
            <Content>
              <Text>…</Text>
            </Content>
          </Modal>
        </ModalTrigger>
      </Header>
      <Text>
        Wenn du dein Projekt löschst, werden alle abhängigen
        Komponenten mitgelöscht.
      </Text>
    </Section>
  </LayoutCard>
);
