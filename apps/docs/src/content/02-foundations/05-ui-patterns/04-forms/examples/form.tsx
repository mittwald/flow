import {
  ActionGroup,
  ColumnLayout,
  FieldDescription,
  Heading,
  Label,
  Section,
  Segment,
  SegmentedControl,
  TextField,
  Text,
} from "@mittwald/flow-react-components";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm, useWatch } from "react-hook-form";

export default () => {
  const form = useForm<{
    firstName: string;
    lastName: string;
    street: string;
    houseNumber: string;
    zip: string;
    city: string;
    phone?: string;
    paymentMethod: "invoice" | "debit";
    accountHolder: string;
    iban: string;
  }>({
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      houseNumber: "",
      phone: "",
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
          <SegmentedControl aria-label="Zahlungsart">
            <Segment value="invoice">Rechnung</Segment>
            <Segment value="debit">Lastschrift</Segment>
          </SegmentedControl>
        </Field>

        {watchedPaymentMethod === "invoice" && (
          <Text>
            Bitte bezahle deine Rechnungen innerhalb von 14
            Tagen.
          </Text>
        )}

        {watchedPaymentMethod === "debit" && (
          <>
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
          </>
        )}

        <Heading>Adresse</Heading>
        <ColumnLayout l={[1, 1]}>
          <Field
            name="firstName"
            rules={{
              required: "Bitte gib einen Vornamen ein",
            }}
          >
            <TextField>
              <Label>Vorname</Label>
            </TextField>
          </Field>
          <Field
            name="lastName"
            rules={{
              required: "Bitte gib einen Nachnamen ein",
            }}
          >
            <TextField>
              <Label>Nachname</Label>
            </TextField>
          </Field>
          <ColumnLayout m={[2, 1]} s={[2, 1]}>
            <Field
              name="street"
              rules={{
                required: "Bitte gib eine Straße ein",
              }}
            >
              <TextField>
                <Label>Straße</Label>
              </TextField>
            </Field>
            <Field
              name="houseNumber"
              rules={{
                required: "Bitte gib eine Hausnr. ein",
              }}
            >
              <TextField>
                <Label>Hausnummer</Label>
              </TextField>
            </Field>
          </ColumnLayout>
          <ColumnLayout m={[1, 2]} s={[1, 2]}>
            <Field
              name="zip"
              rules={{
                required: "Bitte gib eine Postleitzahl ein",
              }}
            >
              <TextField>
                <Label>Postleitzahl</Label>
              </TextField>
            </Field>
            <Field
              name="city"
              rules={{
                required: "Bitte gib einen Ort ein",
              }}
            >
              <TextField>
                <Label>Ort</Label>
              </TextField>
            </Field>
          </ColumnLayout>
          <Field name="phone">
            <TextField>
              <Label>Telefonnummer</Label>
              <FieldDescription>
                Format: +49 5772 293 100
              </FieldDescription>
            </TextField>
          </Field>
        </ColumnLayout>
        <ActionGroup>
          <SubmitButton color="accent">
            Speichern
          </SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
