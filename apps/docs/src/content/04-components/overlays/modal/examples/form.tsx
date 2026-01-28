import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Label,
  Modal,
  TextField,
  useOverlayController,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";

export default () => {
  const controller = useOverlayController("Modal");

  const form = useForm<{ name: string }>();

  const Field = typedField(form);

  const handleSubmit = async () => {
    // submit form

    controller.close();
  };

  return (
    <>
      <Button onPress={controller.open}>
        Modal öffnen
      </Button>

      <Modal controller={controller}>
        <Form form={form} onSubmit={handleSubmit}>
          <Heading>Organisation anlegen</Heading>

          <Content>
            <Field
              name="name"
              rules={{
                required: "Bitte gib einen Namen ein",
              }}
            >
              <TextField>
                <Label>Name</Label>
              </TextField>
            </Field>
          </Content>

          <ActionGroup>
            <SubmitButton color="accent">
              Speichern
            </SubmitButton>
            <Action closeOverlay="Modal">
              <Button color="secondary" variant="soft">
                Abbrechen
              </Button>
            </Action>
          </ActionGroup>
        </Form>
      </Modal>
    </>
  );
};
