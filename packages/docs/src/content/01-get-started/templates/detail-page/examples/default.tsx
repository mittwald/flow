import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import Button from "@mittwald/flow-react-components/Button";
import Section from "@mittwald/flow-react-components/Section";
import Content from "@mittwald/flow-react-components/Content";
import Link from "@mittwald/flow-react-components/Link";
import {
  Modal,
  ModalTrigger,
} from "@mittwald/flow-react-components/Modal";
import Label from "@mittwald/flow-react-components/Label";
import Header from "@mittwald/flow-react-components/Header";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import Alert from "@mittwald/flow-react-components/Alert";
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-react-components/ContextMenu";
import { IconContextMenu } from "@mittwald/flow-react-components/Icons";
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
  };

  const updateOwnerModal = (
    <Modal>
      <Heading>Domain-Inhaber bearbeiten</Heading>

      <Content>
        <Section>
          <ColumnLayout>
            <TextField isRequired defaultValue="Max">
              <Label>Vorname</Label>
            </TextField>
            <TextField isRequired defaultValue="Mustermann">
              <Label>Nachname</Label>
            </TextField>
            <ColumnLayout gap="s" s={[2, 1]}>
              <TextField
                isRequired
                defaultValue="Königsberger Str"
              >
                <Label>Straße</Label>
              </TextField>
              <TextField isRequired defaultValue="4">
                <Label>Hausnr.</Label>
              </TextField>
            </ColumnLayout>
            <ColumnLayout gap="s" s={[1, 2]}>
              <TextField isRequired defaultValue="32339">
                <Label>PLZ</Label>
              </TextField>
              <TextField
                isRequired
                defaultValue="Espelkamp"
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
            Speichern
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  );

  return (
    <LayoutCard>
      <Section>
        {!domain.ssl && (
          <Alert status="danger">
            <Heading>
              Es konnte kein SSL-Zertifikat ausgestellt
              werden
            </Heading>
            <Content>
              <Text>
                Für diese Domain konnte kein SSL-Zertifikat
                ausgestellt werden, da {domain.hostname}{" "}
                nicht per DNS auf deine Server-IP zeigt.
                Ändere den A-Record oder CNAME auf die
                Server-IP zeigen. Es kann einige Minuten
                dauern, bis das Zertifikat bei korrekten
                Einstellungen ausgestellt ist.
              </Text>
              <Link>SSL-Zertifikat ausstellen</Link>
            </Content>
          </Alert>
        )}
      </Section>
      <Section>
        <Header>
          <Heading>Domain-Details</Heading>
          <ContextMenuTrigger>
            <Button color="secondary" variant="soft">
              <IconContextMenu />
            </Button>
            <ContextMenu>
              <MenuItem>Domain umziehen</MenuItem>
              <MenuItem>Domain entfernen</MenuItem>
            </ContextMenu>
          </ContextMenuTrigger>
          <Button>Domain-Ziel ändern</Button>
        </Header>
        <ColumnLayout s={[1, 1]}>
          <LabeledValue>
            <Label>Domain-Ziel</Label>
            <Text>{domain.domain}</Text>
          </LabeledValue>
          <LabeledValue>
            <Label>Zertifikat</Label>
            <Text>{domain.ssl ? domain.ssl : "-"}</Text>
          </LabeledValue>
        </ColumnLayout>
      </Section>
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
              Max Mustermann
              <br />
              Königsberger Str. 4, 32339 Espelkamp
            </Text>
          </LabeledValue>
          <LabeledValue>
            <Label>Kontaktdaten</Label>
            <Text>
              max@mustermann.de
              <br />
              0163/123456789
            </Text>
          </LabeledValue>
        </ColumnLayout>
      </Section>
    </LayoutCard>
  );
};
