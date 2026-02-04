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
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";

export default () => {
  const defaultValues = { name: "" };

  const form = useForm<{ name: string }>({ defaultValues });

  const Field = typedField(form);

  const controller = useOverlayController("Modal", {
    onOpen: () => form.reset(defaultValues),
  });

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
            <Button color="accent" type="submit">
              Speichern
            </Button>
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
