import {
  ActionGroup,
  Heading,
  Label,
  Section,
  TextField,
} from "@mittwald/flow-react-components";
import {
  Form,
  FormRootError,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default () => {
  const form = useForm<{
    localPart: string;
    storageInGb: string;
  }>({
    defaultValues: {
      localPart: "max mustermann",
      storageInGb: "0",
    },
    mode: "onChange",
  });

  const Field = typedField(form);

  // Damit die Fehler im Beispiel sofort sichtbar sind
  useEffect(() => {
    void form.trigger();
  }, [form]);

  const handleSubmit = async () => {
    form.setError("root", {
      message:
        "Die E-Mail-Adresse konnte nicht gespeichert werden.",
    });
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Section>
        <Heading>Fehler stehen am Feld</Heading>

        <FormRootError />

        <Field
          name="localPart"
          rules={{
            required: "Bitte gib einen lokalen Teil ein",
            pattern: {
              value: /^[a-z0-9.-]+$/,
              message:
                "Erlaubt sind Kleinbuchstaben, Ziffern, Punkt und Bindestrich",
            },
          }}
        >
          <TextField>
            <Label>Lokaler Teil</Label>
          </TextField>
        </Field>

        <Field
          name="storageInGb"
          rules={{
            required: "Bitte gib einen Speicherplatz an",
            min: { value: 1, message: "Mindestens 1 GB" },
          }}
        >
          <TextField>
            <Label>Speicherplatz in GB</Label>
          </TextField>
        </Field>

        <ActionGroup>
          <SubmitButton>Speichern</SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
