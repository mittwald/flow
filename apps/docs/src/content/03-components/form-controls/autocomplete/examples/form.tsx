import {
  Button,
  Label,
  Autocomplete,
  Section,
  TextField,
  Option,
} from "@mittwald/flow-react-components";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
  });
  const currentEmail = useWatch({
    name: "email",
    control: form.control,
  });
  const Field = typedField(form);

  const currentEmailValue = form.watch("email");
  const generateSuggestItems = () => {
    return [
      "example.com",
      "test.org",
      "email.net",
      "mail.com",
    ]
      .map((d) => {
        const email = `${currentEmailValue.split("@")[0]}@${d}`;
        return (
          <Option
            key={email}
            value={email}
            textValue={email}
          >
            {email}
          </Option>
        );
      })
      .filter(() => currentEmail);
  };

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="email"
          rules={{
            required: "Bitte wähle eine App aus",
          }}
        >
          <Autocomplete>
            <TextField>
              <Label>Test</Label>
            </TextField>
            {generateSuggestItems()}
          </Autocomplete>
        </Field>
        <Button type="submit">Speichern</Button>
      </Form>
    </Section>
  );
};
