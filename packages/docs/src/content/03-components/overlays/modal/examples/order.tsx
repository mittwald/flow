import Modal from "@mittwald/flow-react-components/Modal";
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
  RadioButton,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import { Slider } from "@mittwald/flow-react-components/Slider";
import { Link } from "@mittwald/flow-react-components/Link";
import { CheckboxButton } from "@mittwald/flow-react-components/CheckboxButton";
import { useOverlayController } from "@mittwald/flow-react-components/controller";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";

export default () => {
  const customerController = useOverlayController();
  const serverController = useOverlayController();

  return (
    <>
      <Button
        color="accent"
        onPress={serverController.open}
      >
        Server buchen
      </Button>

      <Modal
        controller={serverController}
        offCanvas
        size="l"
      >
        <Heading>SpaceServer buchen</Heading>
        <Content>
          <div
            style={{
              position: "sticky",
              background: "#E0EBFF",
              padding: "16px 24px",
              marginTop: "-24px",
              marginInline: "-24px",
              top: "-24px",
              zIndex: "1",
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <div style={{ flexGrow: "1" }}>
              <Heading levelVisual={3}>Gesamt</Heading>
              <Text>alle Preise zzgl. USt.</Text>
            </div>
            <Text>Monatlich:</Text>
            <Heading levelVisual={1}>50 €</Heading>
          </div>
          <Section>
            <TextField isRequired>
              <Label>Servername</Label>
            </TextField>
            <RadioGroup defaultValue="1">
              <Label>Ressourcen wählen</Label>
              <RadioButton value="1">
                <Text>2 vCPU</Text>
                <Content>4 GB RAM</Content>
              </RadioButton>
              <RadioButton value="2">
                <Text>4 vCPU</Text>
                <Content>4 GB RAM</Content>
              </RadioButton>
              <RadioButton value="3">
                <Text>8 vCPU</Text>
                <Content>4 GB RAM</Content>
              </RadioButton>
              <RadioButton value="4">
                <Text>16 vCPU</Text>
                <Content>4 GB RAM</Content>
              </RadioButton>
              <RadioButton value="5">
                <Text>32 vCPU</Text>
                <Content>4 GB RAM</Content>
              </RadioButton>
              <RadioButton value="6">
                <Text>64 vCPU</Text>
                <Content>4 GB RAM</Content>
              </RadioButton>
            </RadioGroup>
            <Text>
              Auf deinem Space-Server kannst du unlimitiert
              viele Projekte anlegen. Wir empfehlen jedoch
              eine maximale Anzahl - basierend auf Analysen
              und langjähriger Erfahrung.
            </Text>
            <Slider
              formatOptions={{
                style: "unit",
                unit: "gigabyte",
              }}
              minValue={20}
              maxValue={2000}
              defaultValue={200}
              step={20}
            >
              <Label>Speicherplatz</Label>
            </Slider>
          </Section>
          <Section>
            <Heading>Organisation wählen</Heading>
            <RadioGroup
              aria-label="Organisation"
              defaultValue="1"
              l={[1, 1]}
            >
              <RadioButton value="1">
                <Text>Agentur Schmidt</Text>
                <Content>
                  Günther Schmitdt
                  <br />
                  Am Horstweg 13, 32361 Musterhausen
                  <br />
                  Tel. +49 1234 124568
                  <br />
                  agentur.schmidt@web.de
                  <br />
                  Rechnung
                </Content>
              </RadioButton>
              <RadioButton value="2">
                <Text>Agentur Schmidt</Text>
                <Content>
                  Günther Schmitdt
                  <br />
                  Am Horstweg 13, 32361 Musterhausen
                  <br />
                  Tel. +49 1234 124568
                  <br />
                  agentur.schmidt@web.de
                  <br />
                  Rechnung
                </Content>
              </RadioButton>
            </RadioGroup>

            <Button
              variant="plain"
              style={{ alignSelf: "center" }}
              onPress={customerController.open}
            >
              Neue Organisation anlegen
            </Button>
          </Section>
          <Section>
            <Heading>Bestellung prüfen</Heading>
            <Text>
              Überprüfe die Angaben zu deiner Bestellung.
              Die Kosten dieser Bestellung werden auf der
              nächsten Rechnung vermerkt, die per E-Mail an
              agentur-schmidt@web.de geschickt wird.
            </Text>
            <CheckboxButton>
              <Text>
                Mit dem Klick auf “Kostenpflichtig buchen”
                erkläre ich, dass ich mit den{" "}
                <Link>AGB</Link> einverstanden bin. Die{" "}
                <Link>Datenschutzhinweise</Link> habe ich
                zur Kenntnis genommen
              </Text>
            </CheckboxButton>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeOverlay>
            <Action action={sleepLong}>
              <Button color="accent">
                Ticket erstellen
              </Button>
            </Action>
            <Button variant="soft" color="secondary">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>

      <Modal
        controller={customerController}
        offCanvas
        size="m"
      >
        <Heading>Organisation anlegen</Heading>
        <Content>
          <Section>
            <ColumnLayout l={[1, 1]}>
              <TextField isRequired>
                <Label>Organisationsname</Label>
              </TextField>
            </ColumnLayout>
          </Section>
          <Section>
            <Heading>Vertragspartner hinzufügen</Heading>
            <Text>
              Lege jetzt einen Vertragspartner an. Der
              Vertragspartner ist der Inhaber deiner
              Organisation und der Inhaber für die Projekte
              in ebendieser.
            </Text>
            <ColumnLayout l={[1, 1]}>
              <TextField>
                <Label>Firma</Label>
              </TextField>
              <TextField>
                <Label>USt-IdNr.</Label>
              </TextField>
              <TextField
                isRequired
                defaultValue="Keine Angabe"
              >
                <Label>Anrede</Label>
              </TextField>
            </ColumnLayout>
            <ColumnLayout l={[1, 1]}>
              <TextField isRequired>
                <Label>Vorname</Label>
              </TextField>
              <TextField isRequired>
                <Label>Nachname</Label>
              </TextField>
              <ColumnLayout s={[2, 1]}>
                <TextField isRequired>
                  <Label>Straße</Label>
                </TextField>
                <TextField isRequired>
                  <Label>Hausnummer</Label>
                </TextField>
              </ColumnLayout>
              <ColumnLayout s={[1, 2]}>
                <TextField isRequired>
                  <Label>PLZ</Label>
                </TextField>
                <TextField isRequired>
                  <Label>Ort</Label>
                </TextField>
              </ColumnLayout>
              <TextField isRequired>
                <Label>Land</Label>
              </TextField>
            </ColumnLayout>
            <ColumnLayout l={[1, 1]}>
              <TextField isRequired>
                <Label>E-Mail-Adresse</Label>
              </TextField>
              <TextField isRequired>
                <Label>Telefonnummer</Label>
              </TextField>
            </ColumnLayout>
          </Section>
          <Section>
            <Heading>Zahlungsart festlegen</Heading>
            <Text>
              Bitte gebe hier an, ob du per Lastschrift oder
              per Rechnung bezahlen möchtest.
            </Text>
            <RadioGroup
              aria-label="Zahlungsart"
              defaultValue="invoice"
              variant="segmented"
            >
              <Radio value="invoice">
                Zahlung per Rechnung
              </Radio>
              <Radio value="debit">
                Zahlung per Lastschrift
              </Radio>
            </RadioGroup>
            <Text>
              Bitte bezahle die Rechnung innerhalb 14 Tagen.
            </Text>
            <Text>
              Die E-Mail-Adresse wird vom Vertragspartner
              übernommen, sofern kein abweichender
              Rechnungsempfänger angegeben wurde.
            </Text>
            <CheckboxButton
              defaultSelected
              style={{
                order: "unset",
                width: "fit-content",
              }}
            >
              Abweichende Rechnungsdaten hinterlegen
            </CheckboxButton>

            <ColumnLayout l={[1, 1]}>
              <TextField>
                <Label>Firma</Label>
              </TextField>
            </ColumnLayout>
            <ColumnLayout l={[1, 1]}>
              <TextField
                isRequired
                defaultValue="Keine Angabe"
              >
                <Label>Anrede</Label>
              </TextField>
            </ColumnLayout>
            <ColumnLayout l={[1, 1]}>
              <TextField isRequired>
                <Label>Vorname</Label>
              </TextField>
              <TextField isRequired>
                <Label>Nachname</Label>
              </TextField>
              <ColumnLayout s={[2, 1]}>
                <TextField isRequired>
                  <Label>Straße</Label>
                </TextField>
                <TextField isRequired>
                  <Label>Hausnummer</Label>
                </TextField>
              </ColumnLayout>
              <ColumnLayout s={[1, 2]}>
                <TextField isRequired>
                  <Label>PLZ</Label>
                </TextField>
                <TextField isRequired>
                  <Label>Ort</Label>
                </TextField>
              </ColumnLayout>
              <TextField isRequired>
                <Label>Land</Label>
              </TextField>
            </ColumnLayout>
            <ColumnLayout l={[1, 1]}>
              <TextField isRequired>
                <Label>E-Mail-Adresse</Label>
              </TextField>
              <TextField isRequired>
                <Label>Telefonnummer</Label>
              </TextField>
            </ColumnLayout>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeOverlay>
            <Action action={sleepLong}>
              <Button color="accent">
                Organisation anlegen
              </Button>
            </Action>
            <Button variant="soft" color="secondary">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </>
  );
};
