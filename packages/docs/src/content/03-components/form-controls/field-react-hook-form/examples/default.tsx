import { useForm } from "react-hook-form";
import { Form } from "@mittwald/flow-react-components/react-hook-form/Form";
import { Field } from "@mittwald/flow-react-components/react-hook-form/Field";
import { TextField } from "@mittwald/flow-react-components/TextField";
import { Label } from "@mittwald/flow-react-components/Label";
import { FieldDescription } from "@mittwald/flow-react-components/FieldDescription";

export default () => {
  interface Values {
    name: string;
  }
  const form = useForm<Values>();

  return (
    <Form form={form} onSubmit={console.log}>
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
    </Form>
  );
};
