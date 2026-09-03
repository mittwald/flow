import { sleepLong } from "@/content/components/actions/action/examples/lib";
import {
  ActionGroup,
  Label,
  Section,
  TextField,
} from "@mittwald/flow-react-components";
import {
  Field,
  Form,
  ResetButton,
  SubmitButton,
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
      <Section>
        <Field
          name="name"
          rules={{
            required: "The project name is required",
          }}
        >
          <TextField>
            <Label>Name</Label>
          </TextField>
        </Field>
        <ActionGroup>
          <ResetButton>Zurücksetzen</ResetButton>
          <SubmitButton>Speichern</SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
