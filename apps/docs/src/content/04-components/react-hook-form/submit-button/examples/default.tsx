import { useForm } from "react-hook-form";
import {
  Field,
  Form,
  SubmitButton,
} from "@mittwald/flow-react-components/react-hook-form";
import {
  Align,
  Label,
  TextField,
} from "@mittwald/flow-react-components";

export default () => {
  interface Values {
    name: string;
  }
  const form = useForm<Values>();

  const handleSubmit = (values: Values) =>
    alert(JSON.stringify(values));

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Align>
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

        <SubmitButton>Speichern</SubmitButton>
      </Align>
    </Form>
  );
};
