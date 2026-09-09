import {
  ColumnLayout,
  CopyButton,
  Header,
  Heading,
  Label,
  LabeledValue,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <LayoutCard>
    <Section>
      <Header>
        <Heading>Verbindungsdaten</Heading>
      </Header>
      <Text>
        Mit diesen Daten richtest du die E-Mail-Adresse in
        deinem E-Mail-Programm ein.
      </Text>
      <ColumnLayout m={[1, 1]}>
        <LabeledValue>
          <Label>Benutzername</Label>
          <Text>max@mustermann.de</Text>
          <CopyButton value="max@mustermann.de" />
        </LabeledValue>
        <LabeledValue>
          <Label>Posteingangsserver</Label>
          <Text>mail.mittwald.de</Text>
          <CopyButton value="mail.mittwald.de" />
        </LabeledValue>
        <LabeledValue>
          <Label>Postausgangsserver</Label>
          <Text>mail.mittwald.de</Text>
          <CopyButton value="mail.mittwald.de" />
        </LabeledValue>
        <LabeledValue>
          <Label>Port (IMAP / SMTP)</Label>
          <Text>993 / 465</Text>
        </LabeledValue>
      </ColumnLayout>
    </Section>
  </LayoutCard>
);
