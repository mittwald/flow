import Modal, {
  ModalTrigger,
} from "@mittwald/flow-react-components/Modal";
import Content from "@mittwald/flow-react-components/Content";
import Text from "@mittwald/flow-react-components/Text";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Heading from "@mittwald/flow-react-components/Heading";
import Action from "@mittwald/flow-react-components/Action";
import { sleepLong } from "@/content/03-components/actions/action/examples/lib";
import { Section } from "@mittwald/flow-react-components/Section";
import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { TextArea } from "@mittwald/flow-react-components/TextArea";

<ModalTrigger>
  <Button color="accent">Ticket erstellen</Button>
  <Modal offCanvas size="l">
    <Heading>Ticket erstellen</Heading>
    <Content>
      <Section>
        <Heading>Auf was bezieht sich das Ticket?</Heading>
        <RadioGroup
          aria-label="Kontext"
          defaultValue="project"
          variant="segmented"
        >
          <Radio value="project">Ein Projekt</Radio>
          <Radio value="server">Ein Server</Radio>
          <Radio value="customer">Eine Organisation</Radio>
          <Radio value="general">Allgemein</Radio>
        </RadioGroup>

        <Text>
          Bitte wähle das passende Projekt und eine
          passenede Kategorie, damit wir dein Ticket
          schnellst Möglich beantworten können.
        </Text>

        <ColumnLayout l={[1, 1]}>
          <TextField defaultValue="Mein Projekt" isRequired>
            <Label>Betroffenes Projekt</Label>
          </TextField>
          <TextField defaultValue="Allgemein" isRequired>
            <Label>Kategorie wählen</Label>
          </TextField>
        </ColumnLayout>
      </Section>

      <Section>
        <Heading>Wer soll Zugriff haben?</Heading>
        <RadioGroup
          aria-label="Zugriff"
          defaultValue="all"
          variant="segmented"
        >
          <Radio value="all">Projektmitglieder</Radio>
          <Radio value="privat">
            Privat (Nur für mich)
          </Radio>
        </RadioGroup>

        <Text>
          Alle <b>Projektadministratoren</b> und alle
          <b> Projektentwickler</b> sollen mitlesen können.
          Die Beteiligten können diese Anfrage in ihrem
          Supportbereich einsehen. Benachrichtigungen
          bekommen sie erst, wenn sie sich an der
          Konversation beteiligen.
        </Text>
      </Section>

      <Section>
        <Heading>Wie können wir dir helfen?</Heading>
        <TextField isRequired>
          <Label>Betreff</Label>
        </TextField>
        <TextArea isRequired>
          <Label>Nachricht</Label>
        </TextArea>
      </Section>
    </Content>
    <ActionGroup>
      <Action closeOverlay>
        <Action action={sleepLong}>
          <Button color="accent">Ticket erstellen</Button>
        </Action>
        <Button variant="soft" color="secondary">
          Abbrechen
        </Button>
      </Action>
    </ActionGroup>
  </Modal>
</ModalTrigger>;
