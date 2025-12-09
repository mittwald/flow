import {
  ComboBox,
  Label,
  Option,
  Section,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ domain: string }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="domain"
          rules={{
            required: "Bitte wähle eine Domain aus",
          }}
        >
          <ComboBox>
            <Label>Domain</Label>
            <Option>mydomain.de</Option>
            <Option>anotherdomain.com</Option>
          </ComboBox>
        </Field>
        <SubmitButton>Speichern</SubmitButton>
      </Form>
    </Section>
  );
};
