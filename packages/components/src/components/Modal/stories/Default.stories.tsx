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
import { useOverlayController } from "@/lib/controller/overlay/useOverlayController";
import { Action } from "@/components/Action";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  parameters: {
    controls: { exclude: ["state", "defaultOpen", "offCanvas"] },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["s", "m", "l"],
    },
  },
  args: {
    size: "s",
  },
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
          <Action closeModal>
            <Button color="accent">Create customer</Button>
            <Button color="secondary" variant="soft">
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
        <Button color="primary" onPress={controller.open}>
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
              <Button color="accent">Create customer</Button>
              <Button color="secondary" variant="soft">
                Abort
              </Button>
            </Action>
          </ButtonGroup>
        </Modal>
      </>
    );
  },
};

export const WithTrigger: Story = {
  render: (props) => (
    <ModalTrigger>
      <Button color="danger">Delete project</Button>
      <Modal {...props}>
        <Heading>Delete project</Heading>
        <Content>
          <Text>Are you sure you want to delete this project?</Text>
        </Content>
        <ButtonGroup>
          <Action closeModal>
            <Button color="danger">Delete project</Button>
            <Button variant="soft" color="secondary">
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

export const OffCanvas: Story = {
  args: { offCanvas: true },
};
