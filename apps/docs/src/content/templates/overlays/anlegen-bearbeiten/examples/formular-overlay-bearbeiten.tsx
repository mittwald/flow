import {
  Action,
  ActionGroup,
  Button,
  Checkbox,
  ColumnLayout,
  Content,
  Heading,
  Label,
  Modal,
  NumberField,
  Section,
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
    description: string;
    storageInGb: number;
    spamProtection: boolean;
  }>({
    defaultValues: {
      description: "Persönliches Postfach",
      storageInGb: 2,
      spamProtection: true,
    },
  });

  const Field = typedField(form);

  const handleSubmit = async () => () => controller.close();

  return (
    <>
      <Button
        variant="soft"
        color="secondary"
        onPress={controller.open}
      >
        Bearbeiten
      </Button>

      <Modal controller={controller} offCanvas>
        <Form form={form} onSubmit={handleSubmit}>
          <Heading>E-Mail-Adresse bearbeiten</Heading>

          <Content>
            <Section>
              <ColumnLayout m={[1, 1]}>
                <Field name="description">
                  <TextField>
                    <Label>Beschreibung</Label>
                  </TextField>
                </Field>
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
              </ColumnLayout>

              <Heading level={3}>Spamschutz</Heading>
              <Field name="spamProtection">
                <Checkbox>
                  <Label>Spamschutz aktivieren</Label>
                </Checkbox>
              </Field>
            </Section>
          </Content>

          <ActionGroup>
            <SubmitButton>Speichern</SubmitButton>
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
