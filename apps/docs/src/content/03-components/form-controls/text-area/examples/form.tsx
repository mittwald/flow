import {
  Label,
  Section,
  TextArea,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ message: string }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="message"
          rules={{
            required: "Bitte gib eine Nachricht ein",
          }}
        >
          <TextArea>
            <Label>Nachricht</Label>
          </TextArea>
        </Field>
        <SubmitButton>Senden</SubmitButton>
      </Form>
    </Section>
  );
};
