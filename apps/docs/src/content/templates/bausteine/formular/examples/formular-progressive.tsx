import {
  ActionGroup,
  ColumnLayout,
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
    paymentMethod: "invoice" | "debit";
    accountHolder: string;
    iban: string;
  }>({
    defaultValues: {
      paymentMethod: "invoice",
      accountHolder: "",
      iban: "",
    },
  });

  const Field = typedField(form);

  const watchedPaymentMethod = useWatch({
    control: form.control,
    name: "paymentMethod",
  });

  return (
    <Form
      form={form}
      onSubmit={() => console.log("submitted")}
    >
      <Section>
        <Heading>Zahlungsart</Heading>
        <Field name="paymentMethod">
          <RadioGroup l={[1, 1]} aria-label="Zahlungsart">
            <RadioButton value="invoice">
              Rechnung
            </RadioButton>
            <RadioButton value="debit">
              Lastschrift
            </RadioButton>
          </RadioGroup>
        </Field>

        {watchedPaymentMethod === "invoice" && (
          <Text>
            Bitte bezahle deine Rechnungen innerhalb von 14
            Tagen.
          </Text>
        )}

        {watchedPaymentMethod === "debit" && (
          <ColumnLayout m={[1, 1]}>
            <Field
              name="accountHolder"
              rules={{
                required:
                  "Bitte gib einen Kontoinhaber ein",
              }}
            >
              <TextField>
                <Label>Kontoinhaber</Label>
              </TextField>
            </Field>
            <Field
              name="iban"
              rules={{
                required: "Bitte gib eine IBAN ein",
              }}
            >
              <TextField>
                <Label>IBAN</Label>
              </TextField>
            </Field>
          </ColumnLayout>
        )}

        <ActionGroup>
          <SubmitButton>Speichern</SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
