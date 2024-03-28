import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import Text from "@/components/Text";
import TextField from "@/components/TextField";
import Label from "@/components/Label";
import Content from "@/components/Content";
import Heading from "@/components/Heading";
import Modal, { ModalTrigger } from "@/components/Modal";
import { useOverlayController } from "@/lib/controller/overlayController/useOverlayController";
import { Action } from "@/components/Action";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,

  render: (props) => {
    return (
      <Modal {...props} defaultOpen>
        <Heading>New Customer</Heading>
        <Content>
          <Text>
            Create a new customer to manage your projects, members and payments.
          </Text>
          <TextField>
            <Label>Customer name</Label>
          </TextField>
        </Content>
        <ButtonGroup>
          <Action
            action={() => {
              console.log("?");
              const c = useOverlayController();
              console.log("!");
              return c.close;
            }}
          >
            <Button variant="accent">Create customer</Button>
            <Button variant="secondary" style="soft">
              Abort
            </Button>
          </Action>
        </ButtonGroup>
      </Modal>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {};

export const WithController: Story = {
  render: (props) => {
    const controller = useOverlayController();

    return (
      <>
        <Button variant="primary" onPress={controller.open}>
          Create customer
        </Button>
        <Modal {...props} controller={controller}>
          <Heading>New Customer</Heading>
          <Content>
            <Text>
              Create a new customer to manage your projects, members and
              payments.
            </Text>
            <TextField>
              <Label>Customer name</Label>
            </TextField>
          </Content>
          <ButtonGroup>
            <Action closeModal>
              <Button variant="accent">Create customer</Button>
              <Button variant="secondary" style="soft">
                Abort
              </Button>
            </Action>
          </ButtonGroup>
        </Modal>
      </>
    );
  },
};

export const WithDialogTrigger: Story = {
  render: (props) => (
    <ModalTrigger>
      <Button variant="danger">Delete project</Button>
      <Modal {...props}>
        <Heading>Delete project</Heading>
        <Content>
          <Text>Are you sure you want to delete this project?</Text>
        </Content>
        <ButtonGroup>
          <Action closeModal>
            <Button variant="danger">Delete project</Button>
            <Button style="soft" variant="secondary">
              Abort
            </Button>
          </Action>
        </ButtonGroup>
      </Modal>
    </ModalTrigger>
  ),
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const Panel: Story = {
  args: { panel: true },
};
