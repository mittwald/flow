import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  asyncFunction,
  asyncLongFunction,
  button,
  syncFunction,
} from "@/components/Button/stories/lib";
import { Modal } from "@/components/Modal";
import { ButtonGroup } from "@/components/ButtonGroup";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Action } from "@/components/Action";

const meta: Meta<typeof Action> = {
  title: "Actions/Action",
  component: Action,
  render: (props) => <Action {...props} />,
  args: {
    action: syncFunction,
    children: button,
  },
  parameters: {
    controls: {
      exclude: [
        "children",
        "action",
        "closeModal",
        "openModal",
        "toggleModal",
        "feedback",
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Action>;

export const Default: Story = {};

export const Async: Story = {
  args: {
    action: asyncFunction,
  },
};

export const AsyncLong: Story = {
  args: {
    action: asyncLongFunction,
  },
};

export const AsyncWithFeedback: Story = {
  args: {
    action: asyncFunction,
    showFeedback: true,
  },
};

export const AsyncLongWithFeedback: Story = {
  args: {
    action: asyncLongFunction,
    showFeedback: true,
  },
};

export const Nested: Story = {
  args: {
    children: <Action action={syncFunction}>{button}</Action>,
  },
};

export const NestedAsync: Story = {
  args: {
    action: asyncFunction,
    children: <Action action={asyncFunction}>{button}</Action>,
  },
};

export const WithConfirmationModal: Story = {
  render: () => (
    <Action action={asyncLongFunction}>
      <Modal slot="actionConfirm">
        <Heading>Delete customer</Heading>
        <Content>Do you really want to delete the customer?</Content>
        <ButtonGroup>
          <Button color="danger">Delete customer</Button>
          <Button color="secondary" variant="soft">
            Abort
          </Button>
        </ButtonGroup>
      </Modal>
      <Button color="secondary" variant="soft">
        Delete customer
      </Button>
    </Action>
  ),
};
