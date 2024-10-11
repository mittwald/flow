import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Button from "@mittwald/flow-react-components/Button";
import Content from "@mittwald/flow-react-components/Content";
import Heading from "@mittwald/flow-react-components/Heading";
import Modal from "@mittwald/flow-react-components/Modal";
import Section from "@mittwald/flow-react-components/Section";
import Text from "@mittwald/flow-react-components/Text";
import type { FC } from "react";
import Action from "@mittwald/flow-react-components/Action";
import type { OverlayController } from "@mittwald/flow-react-components/controller";

interface Props {
  controller: OverlayController;
}

export const TerminateProjectModal: FC<Props> = (props) => {
  const { controller } = props;

  return (
    <Modal controller={controller}>
      <Heading>Projekt kündigen</Heading>
      <Content>
        <Section>
          <Text>Bist du sicher, dass du das Projekt kündigen möchtest?</Text>
        </Section>
      </Content>
      <ActionGroup>
        <Action closeOverlay="Modal">
          <Button color="secondary" variant="soft">
            Abbrechen
          </Button>
          <Button color="danger">Kündigen</Button>
        </Action>
      </ActionGroup>
    </Modal>
  );
};
