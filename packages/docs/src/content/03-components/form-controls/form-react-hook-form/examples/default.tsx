import { useForm } from "react-hook-form";
import {
  Field,
  Form,
} from "@mittwald/flow-react-components/react-hook-form";
import { TextField } from "@mittwald/flow-react-components/TextField";
import { Label } from "@mittwald/flow-react-components/Label";
import { ActionGroup } from "@mittwald/flow-react-components/ActionGroup";
import { Button } from "@mittwald/flow-react-components/Button";
import { Section } from "@mittwald/flow-react-components/Section";
import { FieldDescription } from "@mittwald/flow-react-components/FieldDescription";

export default () => {
  interface Values {
    name: string;
  }
  const form = useForm<Values>();

  const handleOnSubmit = (values: Values) =>
    alert(JSON.stringify(values));

  return (
    <Form form={form} onSubmit={handleOnSubmit}>
      <Section>
        <Field
          name="name"
          rules={{
            required: "The project name is required",
          }}
        >
          <TextField>
            <Label>Name</Label>
            <FieldDescription>
              The name of the project
            </FieldDescription>
          </TextField>
        </Field>
        <ActionGroup>
          <Button type="submit">Save</Button>
        </ActionGroup>
      </Section>
    </Form>
  );
};
