import {
  ActionGroup,
  ColumnLayout,
  FieldDescription,
  Heading,
  Label,
  Section,
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
    firstName: string;
    lastName: string;
    street: string;
    houseNumber: string;
    zip: string;
    city: string;
    phone?: string;
  }>({
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      houseNumber: "",
      phone: "",
    },
  });

  const Field = typedField(form);

  return (
    <Form
      form={form}
      onSubmit={() => console.log("submitted")}
    >
      <Section>
        <Heading>Name</Heading>
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
        </ColumnLayout>
        <Heading>Anschrift</Heading>
        <ColumnLayout l={[1, 1]}>
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
          <ColumnLayout m={[2, 1]} s={[2, 1]}>
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
          <SubmitButton>Speichern</SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
