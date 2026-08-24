import {
  Action,
  ActionGroup,
  Button,
  ColumnLayout,
  Content,
  DatePicker,
  FieldDescription,
  Heading,
  Label,
  Modal,
  ModalTrigger,
  RadioButton,
  RadioGroup,
  Section,
  Segment,
  SegmentedControl,
  Text,
  TextField,
} from "@mittwald/flow-react-components";
import { sleepLong } from "@/content/04-components/actions/action/examples/lib";

<ModalTrigger>
  <Button>OffCanvas öffnen</Button>
  <Modal size="m" offCanvas>
    <Heading>SFTP-Benutzer anlegen</Heading>
    <Content>
      <Section>
        <Heading>Beschreibung</Heading>
        <Text>
          Mit einem SFTP-Benutzer kannst du dich mit deinem
          Projekt verbinden, um z.B. Dateien hochzuladen.
        </Text>
        <ColumnLayout m={[1, 1]}>
          <TextField isRequired>
            <Label>Bezeichnung</Label>
          </TextField>
          <DatePicker>
            <Label>Ablaufdatum</Label>
            <FieldDescription>
              Nach diesem Datum wird der SFTP-Benutzer
              gelöscht.
            </FieldDescription>
          </DatePicker>
        </ColumnLayout>

        <Heading>Authentifizierung</Heading>
        <Text>
          Wähle zwischen der Authentifikation per Passwort
          oder über einen SSH-Key.
        </Text>
        <SegmentedControl
          value="password"
          aria-label="Authentifizierung"
        >
          <Segment value="password">Passwort</Segment>
          <Segment value="ssh">SSH-Key</Segment>
        </SegmentedControl>
        <ColumnLayout s={[1, 1]}>
          <TextField isRequired>
            <Label>Passwort</Label>
          </TextField>
        </ColumnLayout>

        <Heading>Berechtigungen</Heading>
        <Text>
          Wähle hier die Berechtigungen aus, mit denen der
          SFTP-Benutzer zugreifen darf.
        </Text>
        <RadioGroup
          s={[1, 1]}
          defaultValue="read&write"
          aria-label="Berechtigungen"
        >
          <RadioButton value="write">
            <Text>Lesezugriff</Text>
            <Content>
              Der SFTP-Benutzer kann Dateien einsehen und
              herunterladen.
            </Content>
          </RadioButton>
          <RadioButton value="read&write">
            <Text>Lese- und Schreibzugriff</Text>
            <Content>
              Der SFTP-Benutzer kann Dateien einsehen,
              bearbeiten, hoch und herunterladen.
            </Content>
          </RadioButton>
        </RadioGroup>

        <Heading>Verzeichnisauswahl</Heading>
        <Text>
          Hier legst du das Verzeichnis fest, auf das der
          SFTP-Benutzer Zugriff hat.
        </Text>
        <TextField isRequired>
          <Label>Pfad</Label>
        </TextField>
      </Section>
    </Content>
    <ActionGroup>
      <Action closeModal>
        <Action onAction={sleepLong}>
          <Button color="accent">
            SFTP-Benutzer anlegen
          </Button>
        </Action>
        <Button variant="soft" color="secondary">
          Abbrechen
        </Button>
      </Action>
    </ActionGroup>
  </Modal>
</ModalTrigger>;
