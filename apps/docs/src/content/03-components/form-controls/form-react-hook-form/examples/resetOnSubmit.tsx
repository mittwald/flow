import { sleepLong } from "@/content/03-components/actions/action/examples/lib";
import {
  ActionGroup,
  FieldDescription,
  Label,
  TextField,
} from "@mittwald/flow-react-components";
import {
  Field,
  Form,
  SubmitButton,
  ResetButton,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default () => {
  interface Values {
    name: string;
  }
  const form = useForm<Values>({
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form
      form={form}
      onSubmit={async () => {
        await sleepLong();
        // recommended way to reset forms after submit
        return () => {
          form.reset();
        };
      }}
    >
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
    </Form>
  );
};
