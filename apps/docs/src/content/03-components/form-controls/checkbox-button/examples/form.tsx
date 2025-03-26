import {
  Button,
  CheckboxButton,
  Section,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ acceptTerms: boolean }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="acceptTerms"
          rules={{ required: true }}
        >
          <CheckboxButton>
            Ich stimme den AGBs zu und bestätige, dass ich
            die Datenschutzhinweise zur Kenntnis genommen
            habe.
          </CheckboxButton>
        </Field>
        <Button type="submit">Speichern</Button>
      </Form>
    </Section>
  );
};
