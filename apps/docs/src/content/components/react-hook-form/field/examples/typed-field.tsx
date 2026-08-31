import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import {
  Label,
  TextField,
} from "@mittwald/flow-react-components";

export default () => {
  interface Values {
    myField: string;
  }
  const form = useForm<Values>();

  // Only `myField` is allowed for name prop
  const Field = typedField(form);

  return (
    <Form form={form} onSubmit={console.log}>
      <Field name="myField">
        <TextField>
          <Label>Name</Label>
        </TextField>
      </Field>
    </Form>
  );
};
