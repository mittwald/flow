import {
  Checkbox,
  CheckboxGroup,
  Label,
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
  const form = useForm<{ permissions: string[] }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="permissions"
          rules={{
            required:
              "Bitte wähle mindestens eine Berechtigung aus",
          }}
        >
          <CheckboxGroup>
            <Label>Berechtigungen</Label>
            <Checkbox value="read">Lesen</Checkbox>
            <Checkbox value="write">Schreiben</Checkbox>
          </CheckboxGroup>
        </Field>
        <SubmitButton>Speichern</SubmitButton>
      </Form>
    </Section>
  );
};
