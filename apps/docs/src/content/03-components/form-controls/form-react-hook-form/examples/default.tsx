import { useForm } from "react-hook-form";
import { Field } from "@mittwald/flow-react-components/react-hook-form";
import { Form } from "@mittwald/flow-react-components/react-hook-form";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { ActionGroup } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";
import { FieldDescription } from "@mittwald/flow-react-components";

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
