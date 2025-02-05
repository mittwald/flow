import { useForm } from "react-hook-form";
import { Form } from "@mittwald/flow-react-components/react-hook-form";
import { Field } from "@mittwald/flow-react-components/react-hook-form";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { FieldDescription } from "@mittwald/flow-react-components";

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
