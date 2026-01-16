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
  Link,
  Modal,
  ModalTrigger,
  Option,
  RadioButton,
  RadioGroup,
  Section,
  Segment,
  SegmentedControl,
  Select,
  Switch,
  Text,
  TextField,
} from "@mittwald/flow-react-components";
import { sleepLong } from "@/content/04-components/actions/action/examples/lib";

export default () => {
  return (
    <Row>
      <ModalTrigger>
        <Button>Modal S</Button>
        <Modal size="s">
          <Heading>
            Möchtest du die Bestellung wirklich abbrechen?
          </Heading>
          <Content>
            <Section>
              <Text>
                Deine eingegebenen Daten werden nicht
                gespeichert.
              </Text>
            </Section>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Action onAction={sleepLong}>
                <Button color="danger">
                  Bestellung abbrechen
                </Button>
              </Action>
              <Button variant="soft" color="secondary">
                Bestellung fortsetzen
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>

      <ModalTrigger>
        <Button>Modal M</Button>
        <Modal size="m">
          <Heading>Backup anlegen</Heading>
          <Content>
            <Section>
              <Text>
                Das Backup enthält alle Dateien deines
                Dateisystems und den Inhalt deiner
                Datenbanken. Dei Erstellung eines Backups
                dauert in der Regel einige Minuten.
              </Text>
              <ColumnLayout m={[1, 1]}>
                <TextField>
                  <Label>Beschreibung</Label>
                </TextField>
                <Select isRequired>
                  <Label>Speicherdauer</Label>
                  <Option>7 Tage</Option>
                  <Option>14 Tage</Option>
                  <Option>30 Tage</Option>
                  <Option>6 Monate</Option>
                  <Option>12 Monate</Option>
                </Select>
              </ColumnLayout>
            </Section>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Action onAction={sleepLong}>
                <Button color="accent">
                  Backup anlegen
                </Button>
              </Action>
              <Button variant="soft" color="secondary">
                Abbrechen
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>

      <ModalTrigger>
        <Button>OffCanvas S</Button>
        <Modal size="s" offCanvas>
          <Heading>Dashboard-Einstellungen</Heading>
          <Content>
            <Section>
              <Heading>Widget-Sichtbarkeit</Heading>
              <Text>
                Aktiviere und deaktiviere die Widgets, die
                du wirklich benötigst. So bestimmst du
                selbst, wie dein Dashboard aussehen soll.
              </Text>
              <ColumnLayout s={[1]} gap="xl">
                <ColumnLayout s={[1]} gap="s">
                  <Switch>Erste Schritte</Switch>
                  <Text>
                    Im Onboarding erklären wir dir alles
                    Wichtige im mStudio.
                  </Text>
                  <Link>Erste Schritte starten</Link>
                </ColumnLayout>

                <ColumnLayout s={[1]} gap="s">
                  <Switch defaultSelected>
                    mittwald Status
                  </Switch>
                  <Text>
                    Wir informieren dich über Wartung und
                    Störungen.
                  </Text>
                </ColumnLayout>

                <ColumnLayout s={[1]} gap="s">
                  <Switch>mittwald Produkt-Slider</Switch>
                  <Text>
                    Im Produkt-Slider erhälst du
                    Informationen und einen schnellen
                    Einstieg in weitere mittwald Produkte.
                  </Text>
                </ColumnLayout>

                <ColumnLayout s={[1]} gap="s">
                  <Switch defaultSelected>
                    Neue Features
                  </Switch>
                  <Text>
                    Wir entwickeln das mStudio stetig weiter
                    Alle kommenden Features findest du auf
                    der <Link>Roadmap</Link>.
                  </Text>
                  <Link>Changelog öffnen</Link>
                </ColumnLayout>

                <ColumnLayout s={[1]} gap="s">
                  <Switch defaultSelected>
                    Neue Blogbeiträge
                  </Switch>
                  <Text>
                    Wir zeigen dir den neuesten mittwald
                    Blogartikel an.
                  </Text>
                  <Link>Blogartikel öffnen</Link>
                </ColumnLayout>

                <ColumnLayout s={[1]} gap="s">
                  <Switch>Lastschift Hinweis</Switch>
                  <Text>
                    Wir informieren über die neue
                    Möglichkeit, deine Rechnungen per
                    Lastschrift zu bezahlen.
                  </Text>
                </ColumnLayout>
              </ColumnLayout>
            </Section>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Button variant="soft" color="secondary">
                Schließen
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>

      <ModalTrigger>
        <Button>OffCanvas M</Button>
        <Modal size="m" offCanvas>
          <Heading>SFTP-Benutzer anlegen</Heading>
          <Content>
            <Section>
              <Heading>Beschreibung</Heading>
              <Text>
                Mit einem SFTP-Benutzer kannst du dich mit
                deinem Projekt verbinden, um z. B. Dateien
                hochzuladen.
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
                Wähle zwischen der Authentifikation per
                Passwort oder über einen SSH-Key.
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
                Wähle hier die Berechtigungen aus, mit denen
                der SFTP-Benutzer zugreifen darf.
              </Text>
              <RadioGroup
                s={[1, 1]}
                defaultValue="read&write"
                aria-label="Berechtigungen"
              >
                <RadioButton value="write">
                  <Text>Lesezugriff</Text>
                  <Content>
                    Der SFTP-Benutzer kann Dateien einsehen
                    und herunterladen.
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
                Hier legst du das Verzeichnis fest, auf das
                der SFTP-Benutzer Zugriff hat.
              </Text>
              <TextField isRequired>
                <Label>Pfad</Label>
              </TextField>
            </Section>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
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
      </ModalTrigger>
    </Row>
  );
};
