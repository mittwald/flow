import { useForm } from "react-hook-form";
import {
  Field,
  Form,
  FormRootError,
  SubmitButton,
} from "@mittwald/flow-react-components/react-hook-form";
import {
  ActionGroup,
  Label,
  Section,
  TextField,
} from "@mittwald/flow-react-components";

export default () => {
  interface Values {
    email: string;
    password: string;
  }
  const form = useForm<Values>({
    defaultValues: {
      email: "max@mustermann.de",
      password: "password",
    },
  });

  return (
    <Section>
      <Form
        form={form}
        onSubmit={() => {
          form.setError("root", {
            message: "Login fehlgeschlagen",
          });
        }}
      >
        <Field
          name="email"
          rules={{
            required: "Bitte gib eine E-Mail ein",
          }}
        >
          <TextField>
            <Label>E-Mail</Label>
          </TextField>
        </Field>
        <Field
          name="password"
          rules={{
            required: "Bitte gib ein Passwort ein",
          }}
        >
          <TextField type="password">
            <Label>Passwort</Label>
          </TextField>
        </Field>
        <FormRootError />
        <ActionGroup>
          <SubmitButton>Speichern</SubmitButton>
        </ActionGroup>
      </Form>
    </Section>
  );
};
