import {
  ActionGroup,
  FieldDescription,
  Heading,
  Label,
  RadioButton,
  RadioGroup,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-react-components";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm, useWatch } from "react-hook-form";

export default () => {
  const form = useForm<{
    kind: "mailbox" | "forward";
    localPart: string;
    storageInGb: string;
    target: string;
  }>({
    defaultValues: {
      kind: "mailbox",
      localPart: "",
      storageInGb: "2",
      target: "",
    },
  });

  const Field = typedField(form);

  const kind = useWatch({
    control: form.control,
    name: "kind",
  });

  return (
    <Form form={form} onSubmit={() => undefined}>
      <Section>
        <Heading>E-Mail-Adresse anlegen</Heading>

        <Field name="kind">
          <RadioGroup
            l={[1, 1]}
            aria-label="Art der Adresse"
          >
            <RadioButton value="mailbox">
              Postfach
            </RadioButton>
            <RadioButton value="forward">
              Weiterleitung
            </RadioButton>
          </RadioGroup>
        </Field>

        <Field
          name="localPart"
          rules={{
            required: "Bitte gib einen lokalen Teil ein",
          }}
        >
          <TextField>
            <Label>Lokaler Teil</Label>
          </TextField>
        </Field>

        {kind === "mailbox" && (
          <Field
            name="storageInGb"
            rules={{
              required: "Bitte gib einen Speicherplatz an",
            }}
          >
            <TextField>
              <Label>Speicherplatz in GB</Label>
              <FieldDescription>
                Nur ein Postfach speichert E-Mails selbst.
              </FieldDescription>
            </TextField>
          </Field>
        )}

        {kind === "forward" && (
          <Field
            name="target"
            rules={{
              required: "Bitte gib eine Zieladresse ein",
            }}
          >
            <TextField>
              <Label>Zieladresse</Label>
              <FieldDescription>
                Eingehende E-Mails werden an diese Adresse
                zugestellt.
              </FieldDescription>
            </TextField>
          </Field>
        )}

        <Text>
          Die Felder unter der Auswahl wechseln mit ihr –
          die Felder darüber bleiben stehen.
        </Text>

        <ActionGroup>
          <SubmitButton>Anlegen</SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
