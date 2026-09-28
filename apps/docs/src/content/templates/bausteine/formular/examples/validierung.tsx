import {
  ActionGroup,
  Heading,
  Label,
  Section,
  TextArea,
} from "@mittwald/flow-react-components";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default () => {
  const form = useForm<{
    publicKey: string;
  }>({
    defaultValues: {
      publicKey: "",
    },
  });

  const Field = typedField(form);

  return (
    <Form
      form={form}
      onSubmit={() => console.log("submitted")}
    >
      <Section>
        <Heading>Validierung</Heading>
        <Field
          name="publicKey"
          rules={{
            required: "Bitte gib einen SSH-Key ein",
            validate: {
              isValid: (key) =>
                key.startsWith("rsa")
                  ? true
                  : "Der SSH-Key muss mit 'rsa' anfangen",
            },
            minLength: {
              value: 10,
              message:
                "Der SSH-Key muss mindestens 10 Zeichen lang sein",
            },
          }}
        >
          <TextArea maxLength={8000} showCharacterCount>
            <Label>SSH-Key</Label>
          </TextArea>
        </Field>

        <ActionGroup>
          <SubmitButton>Speichern</SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
