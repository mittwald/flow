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
import Section from "@mittwald/flow-react-components/Section";
import {
  IconBackup,
  IconSettings,
  IconSshSftp,
} from "@mittwald/flow-react-components/Icons";
import {
  Select,
  Option,
} from "@mittwald/flow-react-components/Select";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import { Switch } from "@mittwald/flow-react-components/Switch";
import Link from "@mittwald/flow-react-components/Link";
import { DatePicker } from "@mittwald/flow-react-components/DatePicker";
import FieldDescription from "@mittwald/flow-react-components/FieldDescription";
import RadioGroup, {
  Radio,
  RadioButton,
} from "@mittwald/flow-react-components/RadioGroup";

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
              <Action action={sleepLong}>
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
          <Heading>
            <IconBackup />
            <Text>Backup anlegen</Text>
          </Heading>
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
              <Action action={sleepLong}>
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
          <Heading>
            <IconSettings />
            Dashboard-Einstellungen
          </Heading>
          <Content>
            <Section>
              <Heading>Widget-Sichtbarkeit</Heading>
              <Text>
                Aktiviere und deaktiviere die Widgets, die
                du wirklich benötigst. So bestimmst du
                selbst, wie dein Dashboard aussehen soll.
              </Text>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                }}
              >
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
              </div>
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
          <Heading>
            <IconSshSftp />
            SFTP-Benutzer anlegen
          </Heading>
          <Content>
            <Section>
              <Heading>Beschreibung</Heading>
              <Text>
                Mit einem SFTP-Benutzer kannst du dich mit
                deinem Projekt verbinden, um z.B. Dateien
                hochzuladen.
              </Text>
              <ColumnLayout m={[1, 1]}>
                <TextField isRequired>
                  <Label>Beschreibung</Label>
                </TextField>
                <DatePicker>
                  <Label>Ablaufdatum</Label>
                  <FieldDescription>
                    Nach diesem Datum wird der SFTP-Benutzer
                    gelöscht.
                  </FieldDescription>
                </DatePicker>
              </ColumnLayout>
            </Section>
            <Section>
              <Heading>Authentifizierung</Heading>
              <Text>
                Wähle zwischen der Authentifikation per
                Passwort oder über einen SSH-Key.
              </Text>
              <RadioGroup
                variant="segmented"
                value="password"
              >
                <Radio value="password">Passwort</Radio>
                <Radio value="ssh">SSH-Key</Radio>
              </RadioGroup>
              <ColumnLayout s={[1, 1]}>
                <TextField>
                  <Label>Passwort</Label>
                </TextField>
              </ColumnLayout>
            </Section>
            <Section>
              <Heading>Berechtigungen</Heading>
              <Text>
                Wähle hier die Berechtigungen aus, mit denen
                der SFTP-Benutzer zugreifen darf.
              </Text>
              <RadioGroup
                s={[1, 1]}
                defaultValue="read&write"
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
            </Section>
            <Section>
              <Heading>Verzeichnisauswahl</Heading>
              <Text>
                Hier legst du das Verzeichnis fest, auf dsa
                der SFTP-Benutzer Zugriff hat.
              </Text>
              <TextField isRequired>
                <Label>Pfad</Label>
              </TextField>
            </Section>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Action action={sleepLong}>
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
