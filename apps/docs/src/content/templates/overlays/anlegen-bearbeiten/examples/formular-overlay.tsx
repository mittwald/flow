import {
  Action,
  ActionGroup,
  Button,
  Checkbox,
  ColumnLayout,
  Content,
  FieldDescription,
  Heading,
  Label,
  Modal,
  NumberField,
  Option,
  PasswordCreationField,
  Section,
  Select,
  TextField,
  useModalController,
} from "@mittwald/flow-react-components";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default () => {
  const controller = useModalController();

  const form = useForm<{
    localPart: string;
    domain: string;
    password: string;
    storageInGb: number;
    spamProtection: boolean;
  }>({
    defaultValues: {
      localPart: "",
      domain: "mustermann.de",
      password: "",
      storageInGb: 2,
      spamProtection: true,
    },
  });

  const Field = typedField(form);

  const handleSubmit = async () => {
    /** ... anlegen */
    return () => {
      // Erst nach erfolgreichem Anlegen schließen
      controller.close();
    };
  };

  return (
    <>
      <Button onPress={controller.open}>
        E-Mail-Adresse anlegen
      </Button>

      <Modal controller={controller} offCanvas>
        <Form form={form} onSubmit={handleSubmit}>
          <Heading>E-Mail-Adresse anlegen</Heading>

          <Content>
            <Section>
              <ColumnLayout m={[2, 1]}>
                <Field
                  name="localPart"
                  rules={{
                    required:
                      "Bitte gib einen lokalen Teil ein",
                  }}
                >
                  <TextField>
                    <Label>Lokaler Teil</Label>
                    <FieldDescription>
                      Der Teil vor dem @
                    </FieldDescription>
                  </TextField>
                </Field>
                <Field
                  name="domain"
                  rules={{
                    required: "Bitte wähle eine Domain",
                  }}
                >
                  <Select>
                    <Label>Domain</Label>
                    <Option value="mustermann.de">
                      mustermann.de
                    </Option>
                    <Option value="muster-shop.de">
                      muster-shop.de
                    </Option>
                  </Select>
                </Field>
              </ColumnLayout>

              <Field
                name="password"
                rules={{
                  required: "Bitte vergib ein Passwort",
                }}
              >
                <PasswordCreationField>
                  <Label>Passwort</Label>
                </PasswordCreationField>
              </Field>

              <Heading level={3}>Speicherplatz</Heading>
              <Field
                name="storageInGb"
                rules={{
                  required:
                    "Bitte gib einen Speicherplatz an",
                }}
              >
                <NumberField
                  minValue={1}
                  formatOptions={{
                    style: "unit",
                    unit: "gigabyte",
                  }}
                >
                  <Label>Speicherplatz</Label>
                </NumberField>
              </Field>

              <Heading level={3}>Spamschutz</Heading>
              <Field name="spamProtection">
                <Checkbox>
                  <Label>Spamschutz aktivieren</Label>
                </Checkbox>
              </Field>
            </Section>
          </Content>

          <ActionGroup>
            <SubmitButton>Anlegen</SubmitButton>
            <Action closeModal>
              <Button variant="soft" color="secondary">
                Abbrechen
              </Button>
            </Action>
          </ActionGroup>
        </Form>
      </Modal>
    </>
  );
};
