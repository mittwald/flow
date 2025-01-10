"use client";
import {
  Button,
  Heading,
  Modal,
  ModalTrigger,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <>
      <ModalTrigger>
        <Button>Modal trigger</Button>
        <Modal>
          <Heading>Modal title</Heading>
        </Modal>
      </ModalTrigger>
    </>
  );
}
