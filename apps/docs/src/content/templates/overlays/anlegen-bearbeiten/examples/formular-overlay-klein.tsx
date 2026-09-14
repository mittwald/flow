import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Label,
  Modal,
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

  const form = useForm<{ description: string }>({
    defaultValues: { description: "Persönliches Postfach" },
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
        Beschreibung ändern
      </Button>

      <Modal controller={controller} size="s">
        <Form form={form} onSubmit={handleSubmit}>
          <Heading>Beschreibung ändern</Heading>
          <Content>
            <Field
              name="description"
              rules={{
                required: "Bitte gib eine Beschreibung ein",
              }}
            >
              <TextField>
                <Label>Beschreibung</Label>
              </TextField>
            </Field>
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
