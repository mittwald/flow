import {
  Button,
  Label,
  Section,
  TextField,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ url: string }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="url"
          rules={{
            required: "Bitte gib eine URL ein",
          }}
        >
          <TextField>
            <Label>URL</Label>
          </TextField>
        </Field>
        <Button type="submit">Speichern</Button>
      </Form>
    </Section>
  );
};
