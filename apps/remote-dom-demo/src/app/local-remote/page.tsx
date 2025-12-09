"use client";
import { RemoteReceiver } from "@mittwald/flow-remote-core";
import {
  ActionGroup,
  Button,
  Content,
  Heading,
  Modal,
  ModalTrigger,
} from "@mittwald/flow-remote-react-components";
import RemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";
import { RemoteRenderer } from "@mittwald/flow-remote-react-renderer";

const receiver = new RemoteReceiver();

export default function HostPage() {
  return (
    <>
      <RemoteRenderer __remoteReceiver={receiver} />
      <RemoteRoot __remoteReceiver={receiver}>
        <ModalTrigger>
          <Button data-testid="open">Open</Button>
          <Modal>
            <Heading>Modal Heading</Heading>
            <Content>Modal Content</Content>
            <ActionGroup>
              <Button>OK</Button>
            </ActionGroup>
          </Modal>
        </ModalTrigger>
      </RemoteRoot>
    </>
  );
}
