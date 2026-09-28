import {
  Action,
  ActionGroup,
  Alert,
  Button,
  Content,
  FieldDescription,
  Heading,
  Label,
  Modal,
  NumberField,
  Option,
  RadioButton,
  RadioGroup,
  Section,
  Select,
  Text,
  TextArea,
  TextField,
  useModalController,
} from "@mittwald/flow-react-components";
import { useState } from "react";

type RecordType =
  "a" | "cname" | "mx" | "txt" | "caa" | "srv";
type Step = "selectType" | "configure";

export default () => {
  const controller = useModalController();
  const [step, setStep] = useState<Step>("selectType");
  const [type, setType] = useState<RecordType>("a");

  const recordTypes: {
    id: RecordType;
    name: string;
    description: string;
  }[] = [
    {
      id: "a",
      name: "A / AAAA",
      description:
        "Verweist den Namen auf eine IPv4- oder IPv6-Adresse.",
    },
    {
      id: "cname",
      name: "CNAME",
      description:
        "Verweist den Namen als Alias auf einen anderen Hostnamen.",
    },
    {
      id: "mx",
      name: "MX",
      description:
        "Legt fest, welcher Mailserver E-Mails für die Domain annimmt.",
    },
    {
      id: "txt",
      name: "TXT",
      description:
        "Hinterlegt einen frei wählbaren Text, etwa zur Verifizierung oder für SPF.",
    },
    {
      id: "caa",
      name: "CAA",
      description:
        "Bestimmt, welche Zertifizierungsstelle Zertifikate ausstellen darf.",
    },
    {
      id: "srv",
      name: "SRV",
      description:
        "Gibt an, unter welchem Host und Port ein Dienst erreichbar ist.",
    },
  ];

  // The heading takes up the selection: "DNS-Eintrag anlegen" becomes
  // e.g. "MX-Eintrag anlegen".
  const headlines: Record<RecordType, string> = {
    a: "A-/AAAA-Eintrag anlegen",
    cname: "CNAME-Eintrag anlegen",
    mx: "MX-Eintrag anlegen",
    txt: "TXT-Eintrag anlegen",
    caa: "CAA-Eintrag anlegen",
    srv: "SRV-Eintrag anlegen",
  };

  // Every record type carries a time-to-live.
  const ttlField = () => (
    <Select isRequired defaultSelectedKey="auto">
      <Label>TTL</Label>
      <Option value="auto">Automatisch</Option>
      <Option value="300">5 Minuten</Option>
      <Option value="3600">1 Stunde</Option>
      <Option value="14400">4 Stunden</Option>
      <Option value="86400">1 Tag</Option>
    </Select>
  );

  // The selected type decides which fields follow — that is why this is a
  // separate step and not a field in one form.
  const configFields = (recordType: RecordType) => {
    switch (recordType) {
      case "a":
        return (
          <>
            <Text>
              Mit einem A-Record (A steht für Address)
              leitest du eine Domain oder Subdomain an eine
              IP-Adresse weiter. Er ist also entscheidend
              für die Zuordnung von Domainnamen zu
              physischen Servern im Internet.
            </Text>
            {ttlField()}
            <TextField isRequired>
              <Label>IP-Adresse</Label>
            </TextField>
          </>
        );
      case "mx":
        return (
          <>
            <Text>
              Ein MX-Record leitet E-Mails an einen
              Mailserver weiter. Es ist üblich, für eine
              Domäne mehrere MX-Records zu definieren mit
              unterschiedlichen Prioritäten, so dass bei
              Ausfall eines Mail-Servers ein anderer die
              E-Mails entgegennehmen kann.
            </Text>
            {ttlField()}
            <TextField isRequired>
              <Label>Hostname</Label>
            </TextField>
            <NumberField isRequired>
              <Label>Priorität</Label>
            </NumberField>
          </>
        );
      case "txt":
        return (
          <>
            <Text>
              Ein TXT-Record ist ein Eintrag im DNS, mit dem
              ein frei definierbarer Text in einer DNS-Zone
              abgelegt werden kann.
            </Text>
            {ttlField()}
            <TextArea isRequired>
              <Label>Eintrag</Label>
            </TextArea>
          </>
        );
      case "caa":
        return (
          <>
            <Text>
              Mit einem CAA-Record (Certificate Authority
              Authorization) können Domain-Inhaber über das
              DNS festlegen, welche Zertifizierungsstellen
              berechtigt sind, Zertifikate für ihre Domain
              oder Subdomain auszustellen.
            </Text>
            {ttlField()}
            <Select isRequired defaultSelectedKey="iodef">
              <Label>Tag</Label>
              <Option value="issue">issue</Option>
              <Option value="issuewild">issuewild</Option>
              <Option value="iodef">iodef</Option>
            </Select>
            <Select isRequired defaultSelectedKey="128">
              <Label>Flag</Label>
              <Option value="128">128 (critical)</Option>
              <Option value="0">0 (undefined)</Option>
            </Select>
            <TextField isRequired>
              <Label>Domain</Label>
            </TextField>
          </>
        );
      case "cname":
        return (
          <>
            <Text>
              Ein Canonical Name- oder CNAME-Record ist ein
              DNS-Eintrag, der einen Aliasnamen dem
              eigentlichen oder kanonischen Domainnamen
              zuordnet.
            </Text>
            {ttlField()}
            <TextField isRequired>
              <Label>Ziel</Label>
            </TextField>
            <Alert status="info">
              <Heading>
                DNS-Records werden überschrieben
              </Heading>
              <Content>
                Wenn ein CNAME-Record für die DNS-Zone
                angelegt wird, werden alle bereits
                angelegten DNS-Records entfernt.
              </Content>
            </Alert>
          </>
        );
      case "srv":
        return (
          <>
            <Text>
              Mit einem SRV-Record kannst du einen Host und
              einen Port für spezifische Dienste angeben.
            </Text>
            {ttlField()}
            <TextField isRequired>
              <Label>Dienst</Label>
              <FieldDescription>
                z. B. _sip
              </FieldDescription>
            </TextField>
            <Select isRequired defaultSelectedKey="_tcp">
              <Label>Protokoll</Label>
              <Option value="_tcp">_tcp</Option>
              <Option value="_udp">_udp</Option>
            </Select>
            <NumberField isRequired>
              <Label>Priorität</Label>
            </NumberField>
            <NumberField isRequired>
              <Label>Gewichtung</Label>
            </NumberField>
            <NumberField isRequired>
              <Label>Port</Label>
            </NumberField>
            <TextField isRequired>
              <Label>Host</Label>
            </TextField>
          </>
        );
    }
  };

  return (
    <>
      <Button
        onPress={() => {
          setStep("selectType");
          setType("a");
          controller.open();
        }}
      >
        DNS-Eintrag anlegen
      </Button>

      <Modal controller={controller} offCanvas>
        <Heading>
          {step === "selectType"
            ? "DNS-Eintrag anlegen"
            : headlines[type]}
        </Heading>

        <Content>
          {step === "selectType" && (
            <Section>
              <Text>
                Wähle aus, welche Art von Eintrag du anlegen
                möchtest.
              </Text>
              <RadioGroup
                aria-label="Eintragstyp"
                value={type}
                onChange={(value) =>
                  setType(value as RecordType)
                }
              >
                {recordTypes.map((record) => (
                  <RadioButton
                    key={record.id}
                    value={record.id}
                  >
                    <Text>{record.name}</Text>
                    <Content>{record.description}</Content>
                  </RadioButton>
                ))}
              </RadioGroup>
            </Section>
          )}

          {step === "configure" && (
            <Section>{configFields(type)}</Section>
          )}
        </Content>

        <ActionGroup>
          {step === "selectType" && (
            <Button onPress={() => setStep("configure")}>
              Weiter
            </Button>
          )}
          {step === "configure" && (
            <>
              <Action closeModal>
                <Button color="success">Anlegen</Button>
              </Action>
              <Button
                slot="secondary"
                variant="soft"
                color="secondary"
                onPress={() => setStep("selectType")}
              >
                Zurück
              </Button>
            </>
          )}
          <Action closeModal>
            <Button variant="soft" color="secondary">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </>
  );
};
