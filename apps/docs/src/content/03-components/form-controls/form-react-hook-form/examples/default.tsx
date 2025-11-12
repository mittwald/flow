import { useForm } from "react-hook-form";
import {
  Field,
  Form,
  SubmitButton,
  ResetButton,
} from "@mittwald/flow-react-components/react-hook-form";
import {
  ActionGroup,
  FieldDescription,
  Label,
  Section,
  TextField,
} from "@mittwald/flow-react-components";

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
          <ResetButton>Reset</ResetButton>
          <SubmitButton>Save</SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
