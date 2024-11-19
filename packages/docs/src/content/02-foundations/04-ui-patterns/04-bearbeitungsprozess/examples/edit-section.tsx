import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import Button from "@mittwald/flow-react-components/Button";
import Section from "@mittwald/flow-react-components/Section";
import Content from "@mittwald/flow-react-components/Content";
import {
  Modal,
  ModalTrigger,
} from "@mittwald/flow-react-components/Modal";
import Label from "@mittwald/flow-react-components/Label";
import Header from "@mittwald/flow-react-components/Header";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import TextField from "@mittwald/flow-react-components/TextField";
import { ActionGroup } from "@mittwald/flow-react-components/ActionGroup";
import { Action } from "@mittwald/flow-react-components/Action";

export default () => {
  const domain = {
    id: "4",
    hostname: "example.de",
    domain: "example.de",
    type: "Domain",
    ssl: undefined,
    owner: {
      firstName: "Franz",
      lastName: "Müller",
      street: "Jackenweg",
      houseNumber: "44a",
      zip: "12893",
      city: "Lanzhausen",
      email: "f.mueller@mittwald.de",
    },
  };

  const updateOwnerModal = (
    <Modal>
      <Heading>Domain-Inhaber bearbeiten</Heading>
      <Content>
        <Section>
          <ColumnLayout>
            <TextField
              isRequired
              defaultValue={domain.owner.firstName}
            >
              <Label>Vorname</Label>
            </TextField>
            <TextField
              isRequired
              defaultValue={domain.owner.lastName}
            >
              <Label>Nachname</Label>
            </TextField>
            <ColumnLayout gap="s" s={[2, 1]}>
              <TextField
                isRequired
                defaultValue={domain.owner.street}
              >
                <Label>Straße</Label>
              </TextField>
              <TextField
                isRequired
                defaultValue={domain.owner.houseNumber}
              >
                <Label>Hausnr.</Label>
              </TextField>
            </ColumnLayout>
            <ColumnLayout gap="s" s={[1, 2]}>
              <TextField
                isRequired
                defaultValue={domain.owner.zip}
              >
                <Label>PLZ</Label>
              </TextField>
              <TextField
                isRequired
                defaultValue={domain.owner.city}
              >
                <Label>Ort</Label>
              </TextField>
            </ColumnLayout>
          </ColumnLayout>
        </Section>
      </Content>
      <ActionGroup>
        <Action closeOverlay="Modal">
          <Button color="secondary" variant="soft">
            Abbrechen
          </Button>
          <Button color="accent" type="submit">
            Änderungen speichern
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  );

  return (
    <LayoutCard>
      <Section>
        <Header>
          <Heading>Domain-Inhaber</Heading>
          <ModalTrigger>
            <Button color="secondary" variant="soft">
              Bearbeiten
            </Button>
            {updateOwnerModal}
          </ModalTrigger>
        </Header>
        <ColumnLayout>
          <LabeledValue>
            <Label>Inhaber</Label>
            <Text>
              {domain.owner.firstName}{" "}
              {domain.owner.lastName}
              <br />
              {domain.owner.street}{" "}
              {domain.owner.houseNumber}
              <br />
              {domain.owner.zip} {domain.owner.city}
            </Text>
          </LabeledValue>
          <LabeledValue>
            <Label>E-Mail-Adresse</Label>
            <Text>{domain.owner.email}</Text>
          </LabeledValue>
        </ColumnLayout>
      </Section>
    </LayoutCard>
  );
};
