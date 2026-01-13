import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import Content from "@/components/Content";
import Heading from "@/components/Heading";
import { Label } from "@/components/Label";
import LabeledValue from "@/components/LabeledValue";
import Modal, { ModalTrigger } from "@/components/Modal";
import { Section } from "@/components/Section";
import { TextField } from "@/components/TextField";
import { typedField } from "@/integrations/react-hook-form/components/Field";
import { Form } from "@/integrations/react-hook-form/components/Form/Form";
import { sleep } from "@/lib/promises/sleep";
import { action } from "storybook/actions";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

const submitAction = action("submit");

const meta: Meta<typeof Form> = {
  title: "Integrations/React Hook Form/Form",
  component: Form,
  render: (props) => {
    interface Values {
      name: string;
    }

    const form = useForm<Values>({
      defaultValues: {
        name: "",
      },
    });

    const handleSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const Field = typedField(form);

    return (
      <ModalTrigger>
        <Button>Open modal</Button>
        <Modal>
          <Form {...props} form={form} onSubmit={handleSubmit}>
            <Heading>Modal</Heading>
            <Content>
              <Section>
                <Field name="name">
                  <TextField>
                    <Label>Name</Label>
                  </TextField>
                </Field>
                <LabeledValue>
                  <Label>Watched value</Label>
                  <Content>{form.watch("name")}</Content>
                </LabeledValue>
              </Section>
            </Content>
            <ActionGroup>
              <Button type="submit">Submit</Button>
            </ActionGroup>
          </Form>
        </Modal>
      </ModalTrigger>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {};

export const ReadOnly: Story = { args: { isReadOnly: true } };
