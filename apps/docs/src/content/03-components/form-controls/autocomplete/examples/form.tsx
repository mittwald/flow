import {
  Label,
  Autocomplete,
  Section,
  TextField,
  Option,
} from "@mittwald/flow-react-components";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
  });
  const Field = typedField(form);

  const currentEmailValue = useWatch({
    name: "email",
    control: form.control,
  });

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
      .filter(() => currentEmailValue);
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
        <SubmitButton>Speichern</SubmitButton>
      </Form>
    </Section>
  );
};
