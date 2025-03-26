import {
  Button,
  Label,
  Option,
  Section,
  Select,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ app: string }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="app"
          rules={{
            required: "Bitte wähle eine App aus",
          }}
        >
          <Select>
            <Label>App</Label>
            <Option value="wordpress">WordPress</Option>
            <Option value="typo3">TYPO3</Option>
          </Select>
        </Field>
        <Button type="submit">Speichern</Button>
      </Form>
    </Section>
  );
};
