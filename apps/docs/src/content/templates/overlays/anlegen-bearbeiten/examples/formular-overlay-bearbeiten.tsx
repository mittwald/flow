import {
  Action,
  ActionGroup,
  Button,
  ColumnLayout,
  Content,
  FieldDescription,
  Heading,
  Label,
  Modal,
  Section,
  Switch,
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
    storageInGb: string;
    spamProtection: boolean;
  }>({
    defaultValues: {
      description: "Persönliches Postfach",
      storageInGb: "2",
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
                    <FieldDescription>
                      Nur für dich sichtbar.
                    </FieldDescription>
                  </TextField>
                </Field>
                <Field
                  name="storageInGb"
                  rules={{
                    required:
                      "Bitte gib einen Speicherplatz an",
                  }}
                >
                  <TextField>
                    <Label>Speicherplatz in GB</Label>
                  </TextField>
                </Field>
              </ColumnLayout>

              <Field name="spamProtection">
                <Switch>
                  <Label>Spamschutz aktivieren</Label>
                </Switch>
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
