import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Content from "@mittwald/flow-react-components/Content";
import Heading from "@mittwald/flow-react-components/Heading";
import Label from "@mittwald/flow-react-components/Label";
import Modal from "@mittwald/flow-react-components/Modal";
import Section from "@mittwald/flow-react-components/Section";
import TextField from "@mittwald/flow-react-components/TextField";
import { FC } from "react";

export const AddDomainModal: FC = () => {
  return (
    <Modal offCanvas>
      <Heading>Domain anlegen</Heading>
      <Content>
        <Section>
          <TextField>
            <Label>Domain</Label>
          </TextField>
        </Section>
      </Content>
      <ActionGroup>
        <Button color="secondary" variant="soft">
          Abbrechen
        </Button>
        <Button color="accent">Domain anlegen</Button>
      </ActionGroup>
    </Modal>
  );
};
