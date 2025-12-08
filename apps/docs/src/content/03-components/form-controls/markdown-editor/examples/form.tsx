import {
  Label,
  MarkdownEditor,
  Section,
  ActionGroup,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Field,
  Form,
  SubmitButton,
} from "@mittwald/flow-react-components/react-hook-form";

export default () => {
  const form = useForm({
    defaultValues: { message: "" },
  });
  return (
    <Section>
      <Form
        form={form}
        onSubmit={(v) => console.log(v.message)}
      >
        <Field
          name="message"
          rules={{
            required: "Bitte gib eine Nachricht ein",
          }}
        >
          <MarkdownEditor placeholder="Schreibe eine Nachricht ...">
            <Label>Nachricht</Label>
          </MarkdownEditor>
        </Field>
        <ActionGroup>
          <SubmitButton color="accent">Senden</SubmitButton>
        </ActionGroup>
      </Form>
    </Section>
  );
};
