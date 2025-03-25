import {
  Button,
  Label,
  NumberField,
  Section,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ age: number }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="age"
          rules={{
            required: "Bitte gib dein Alter an",
          }}
        >
          <NumberField minValue={0}>
            <Label>Alter</Label>
          </NumberField>
        </Field>
        <Button type="submit">Speichern</Button>
      </Form>
    </Section>
  );
};
