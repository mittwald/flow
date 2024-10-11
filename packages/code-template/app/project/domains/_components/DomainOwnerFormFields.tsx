import type { FC } from "react";
import { typedField } from "@mittwald/flow-react-components/react-hook-form";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";
import type { DomainOwner } from "@/api/domainApi";
import type { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<DomainOwner>;
}

export const DomainOwnerFormFields: FC<Props> = (props) => {
  const { form } = props;

  const Field = typedField(form);

  return (
    <>
      <ColumnLayout>
        <Field
          name="firstName"
          rules={{ required: "Bitte gib einen Vornamen an" }}
        >
          <TextField autoComplete="given-name">
            <Label>Vorname</Label>
          </TextField>
        </Field>
        <Field
          name="lastName"
          rules={{ required: "Bitte gib einen Nachnamen an" }}
        >
          <TextField autoComplete="family-name">
            <Label>Nachname</Label>
          </TextField>
        </Field>
        <ColumnLayout s={[2, 1]} columnGap="s">
          <Field name="street" rules={{ required: "Bitte gib eine Straße an" }}>
            <TextField autoComplete="address-line1">
              <Label>Straße</Label>
            </TextField>
          </Field>
          <Field
            name="houseNumber"
            rules={{ required: "Bitte gib eine Hausnummer an" }}
          >
            <TextField autoComplete="address-line2">
              <Label>Hausnummer</Label>
            </TextField>
          </Field>
        </ColumnLayout>
        <ColumnLayout s={[1, 2]} columnGap="s">
          <Field
            name="zip"
            rules={{ required: "Bitte gib eine Postleitzahl an" }}
          >
            <TextField autoComplete="postal-code">
              <Label>Postleitzahl</Label>
            </TextField>
          </Field>
          <Field name="city" rules={{ required: "Bitte gib einen Ort an" }}>
            <TextField autoComplete="address-level2">
              <Label>Ort</Label>
            </TextField>
          </Field>
        </ColumnLayout>
        <Field name="country" rules={{ required: "Bitte gib ein Land an" }}>
          <TextField autoComplete="country">
            <Label>Land</Label>
          </TextField>
        </Field>
      </ColumnLayout>
      <ColumnLayout>
        <Field
          name="email"
          rules={{ required: "Bitte gib eine E-Mail-Adresse an" }}
        >
          <TextField autoComplete="email" type="email">
            <Label>E-Mail-Adresse</Label>
          </TextField>
        </Field>
        <Field name="phone">
          <TextField autoComplete="tel" type="tel">
            <Label>Telefonnummer</Label>
          </TextField>
        </Field>
      </ColumnLayout>
    </>
  );
};

export default DomainOwnerFormFields;
