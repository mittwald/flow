import Modal from "@mittwald/flow-react-components/Modal";
import Content from "@mittwald/flow-react-components/Content";
import Label from "@mittwald/flow-react-components/Label";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Heading from "@mittwald/flow-react-components/Heading";
import Action from "@mittwald/flow-react-components/Action";
import { useOverlayController } from "@mittwald/flow-react-components/controller";
import { useForm } from "react-hook-form";
import { Form } from "@mittwald/flow-react-components/react-hook-form/Form";
import { typedField } from "@mittwald/flow-react-components/react-hook-form/Field";
import { TextField } from "@mittwald/flow-react-components/TextField";

export default () => {
  const controller = useOverlayController("Modal");

  const form = useForm<{ name: string }>();

  const Field = typedField(form);

  const handleOnSubmit = async () => {
    // submit form

    controller.close();
  };

  return (
    <>
      <Button onPress={controller.open}>
        Modal öffnen
      </Button>

      <Modal controller={controller}>
        <Form form={form} onSubmit={handleOnSubmit}>
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
