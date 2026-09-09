import {
  Action,
  ActionGroup,
  Button,
  Content,
  FieldDescription,
  Heading,
  Label,
  Modal,
  Option,
  ProgressBar,
  Section,
  Select,
  Switch,
  Text,
  TextField,
  useModalController,
} from "@mittwald/flow-react-components";
import { useState } from "react";

type Step = "selectDomain" | "configure" | "security";

export default () => {
  const steps: Step[] = [
    "selectDomain",
    "configure",
    "security",
  ];

  const titles: Record<Step, string> = {
    selectDomain: "Domain wählen",
    configure: "Adresse festlegen",
    security: "Schutz einrichten",
  };

  const controller = useModalController();
  const [step, setStep] = useState<Step>("selectDomain");

  const index = steps.indexOf(step);
  const isLast = index === steps.length - 1;

  return (
    <>
      <Button
        onPress={() => {
          setStep("selectDomain");
          controller.open();
        }}
      >
        E-Mail-Adresse anlegen
      </Button>

      <Modal controller={controller} offCanvas>
        <Heading>E-Mail-Adresse anlegen</Heading>

        <Content>
          <Section>
            <ProgressBar
              value={index + 1}
              maxValue={steps.length}
              showMaxValue
              status="info"
            >
              <Label>
                Schritt {index + 1}: {titles[step]}
              </Label>
            </ProgressBar>

            {step === "selectDomain" && (
              <Select
                isRequired
                defaultSelectedKey="mustermann.de"
              >
                <Label>Domain</Label>
                <Option value="mustermann.de">
                  mustermann.de
                </Option>
                <Option value="muster-shop.de">
                  muster-shop.de
                </Option>
              </Select>
            )}

            {step === "configure" && (
              <TextField isRequired>
                <Label>Lokaler Teil</Label>
                <FieldDescription>
                  Der Teil vor dem @
                </FieldDescription>
              </TextField>
            )}

            {step === "security" && (
              <>
                <Switch defaultSelected>
                  <Label>Spamschutz aktivieren</Label>
                </Switch>
                <Text>
                  Bei mehr als zwei Stufen hilft eine
                  Anzeige, wie weit der Vorgang ist – aber
                  nur, solange die Zahl der Schritte
                  feststeht.
                </Text>
              </>
            )}
          </Section>
        </Content>

        <ActionGroup>
          {isLast ? (
            <Action closeModal>
              <Button color="success">Anlegen</Button>
            </Action>
          ) : (
            <Button
              color="success"
              onPress={() =>
                setStep(steps[index + 1] as Step)
              }
            >
              Weiter
            </Button>
          )}
          {index > 0 && (
            <Button
              slot="secondary"
              variant="soft"
              color="secondary"
              onPress={() =>
                setStep(steps[index - 1] as Step)
              }
            >
              Zurück
            </Button>
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
