import { useForm } from "react-hook-form";
import {
  Field,
  Form,
} from "@mittwald/flow-react-components/react-hook-form";
import {
  Label,
  TextField,
} from "@mittwald/flow-react-components";

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
          required: "Bitte gib einen Namen ein",
        }}
      >
        <TextField>
          <Label>Name</Label>
        </TextField>
      </Field>
    </Form>
  );
};
