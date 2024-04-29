import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import Text from "@/components/Text";
import TextField from "@/components/TextField";
import Label from "@/components/Label";
import Content from "@/components/Content";
import Heading from "@/components/Heading";
import Modal from "@/components/Modal";
import { useOverlayController } from "@/lib/controller/overlay/useOverlayController";
import { Action } from "@/components/Action";
import { OverlayTrigger } from "@/components/Overlay";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  parameters: {
    controls: { exclude: ["controller", "offCanvas"] },
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
      <Modal
        {...props}
        controller={useOverlayController({ defaultOpen: true })}
      >
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
          <Action closeOverlay>
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
            <Action closeOverlay>
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

export const WithTrigger: Story = {
  render: (props) => (
    <OverlayTrigger>
      <Button variant="danger">Delete project</Button>
      <Modal {...props}>
        <Heading>Delete project</Heading>
        <Content>
          <Text>Are you sure you want to delete this project?</Text>
        </Content>
        <ButtonGroup>
          <Action closeOverlay>
            <Button variant="danger">Delete project</Button>
            <Button style="soft" variant="secondary">
              Abort
            </Button>
          </Action>
        </ButtonGroup>
      </Modal>
    </OverlayTrigger>
  ),
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const OffCanvas: Story = {
  args: { offCanvas: true },
};
