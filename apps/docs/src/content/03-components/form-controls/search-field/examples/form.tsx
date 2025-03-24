import {
  Button,
  SearchField,
  Section,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ search: string }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="search"
          rules={{
            required: "Bitte gib etwas in die Suche ein",
          }}
        >
          <SearchField />
        </Field>
        <Button type="submit">Suchen</Button>
      </Form>
    </Section>
  );
};
