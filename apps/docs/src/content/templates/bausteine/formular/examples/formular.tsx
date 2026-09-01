import {
  ActionGroup,
  ColumnLayout,
  FieldDescription,
  Heading,
  Label,
  Option,
  Section,
  Select,
  Switch,
  TextField,
} from "@mittwald/flow-react-components";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default () => {
  const form = useForm<{
    localPart: string;
    domain: string;
    storageInGb: string;
    spamProtection: boolean;
  }>({
    defaultValues: {
      localPart: "max",
      domain: "mustermann.de",
      storageInGb: "2",
      spamProtection: true,
    },
  });

  const Field = typedField(form);

  const handleSubmit = async () => {
    /** ... speichern */
  };

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Section>
        <Heading>E-Mail-Adresse bearbeiten</Heading>

        <ColumnLayout m={[2, 1]}>
          <Field
            name="localPart"
            rules={{
              required: "Bitte gib einen lokalen Teil ein",
            }}
          >
            <TextField>
              <Label>Lokaler Teil</Label>
              <FieldDescription>
                Der Teil vor dem @
              </FieldDescription>
            </TextField>
          </Field>
          <Field name="domain">
            <Select>
              <Label>Domain</Label>
              <Option value="mustermann.de">
                mustermann.de
              </Option>
              <Option value="muster-shop.de">
                muster-shop.de
              </Option>
            </Select>
          </Field>
        </ColumnLayout>

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

        <Field name="spamProtection">
          <Switch>
            <Label>Spamschutz aktivieren</Label>
          </Switch>
        </Field>

        <ActionGroup>
          <SubmitButton>Speichern</SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
