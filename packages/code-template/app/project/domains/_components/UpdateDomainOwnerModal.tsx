import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import Content from "@mittwald/flow-react-components/Content";
import Heading from "@mittwald/flow-react-components/Heading";
import Label from "@mittwald/flow-react-components/Label";
import Modal from "@mittwald/flow-react-components/Modal";
import Section from "@mittwald/flow-react-components/Section";
import TextField from "@mittwald/flow-react-components/TextField";
import { FC } from "react";
import { DomainOwner } from "@/api/domainApi";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm } from "react-hook-form";
import Action from "@mittwald/flow-react-components/Action";
import { useOverlayController } from "@mittwald/flow-react-components/controller";

interface Props {
  owner: DomainOwner;
}
export const UpdateDomainOwnerModal: FC<Props> = (props) => {
  const { owner } = props;

  const controller = useOverlayController("Modal");

  const form = useForm<DomainOwner>({
    defaultValues: {
      firstName: owner.firstName,
      lastName: owner.lastName,
      street: owner.street,
      houseNumber: owner.houseNumber,
      zip: owner.zip,
      city: owner.city,
      country: owner.country,
      email: owner.email,
      phone: owner.phone,
    },
  });

  const Field = typedField(form);

  const handleOnSubmit = async (values: DomainOwner) => {
    console.log(values);
    controller.close();
    form.reset();
  };

  return (
    <Modal>
      <Form form={form} onSubmit={handleOnSubmit}>
        <Heading>Domain-Inhaber bearbeiten</Heading>
        <Content>
          <Section>
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
                <Field
                  name="street"
                  rules={{ required: "Bitte gib eine Straße an" }}
                >
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
                <Field
                  name="city"
                  rules={{ required: "Bitte gib einen Ort an" }}
                >
                  <TextField autoComplete="address-level2">
                    <Label>Ort</Label>
                  </TextField>
                </Field>
              </ColumnLayout>
              <Field
                name="country"
                rules={{ required: "Bitte gib ein Land an" }}
              >
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
          </Section>
        </Content>
        <ActionGroup>
          <Action closeOverlay="Modal">
            <Action action={() => form.reset()}>
              <Button color="secondary" variant="soft">
                Abbrechen
              </Button>
            </Action>
          </Action>
          <Button color="accent" type="submit">
            Speichern
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};
