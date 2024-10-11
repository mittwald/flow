import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Content from "@mittwald/flow-react-components/Content";
import Heading from "@mittwald/flow-react-components/Heading";
import Modal from "@mittwald/flow-react-components/Modal";
import Section from "@mittwald/flow-react-components/Section";
import type { FC } from "react";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";
import Action from "@mittwald/flow-react-components/Action";
import type { OverlayController } from "@mittwald/flow-react-components/controller";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";

interface Props {
  name: string;
  controller: OverlayController;
}

interface Values {
  name: string;
}

export const UpdateProjectNameModal: FC<Props> = (props) => {
  const { name, controller } = props;

  const form = useForm<Values>({
    defaultValues: {
      name,
    },
  });

  const Field = typedField(form);

  const handleOnSubmit = async (values: Values) => {
    console.log(values);
    controller.close();
    form.reset();
  };

  return (
    <Modal controller={controller}>
      <Form form={form} onSubmit={handleOnSubmit}>
        <Heading>Projektname bearbeiten</Heading>
        <Content>
          <Section>
            <Field
              name="name"
              rules={{ required: "Bitte gib einen Vornamen an" }}
            >
              <TextField>
                <Label>Projektname</Label>
              </TextField>
            </Field>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeOverlay="Modal">
            <Action action={() => form.reset()}>
              <Button color="secondary" variant="soft">
                Abbrechen
              </Button>
            </Action>
          </Action>
          <Button color="accent" type="submit">
            Speichern
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
