import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  asyncFunction,
  asyncLongFunction,
  button,
  syncFunction,
} from "@/components/Button/stories/lib";
import { Modal } from "@/components/Modal";
import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Action } from "@/components/Action";
import ContextMenu, { ContextMenuTrigger } from "@/components/ContextMenu";
import { MenuItem } from "@/components/MenuItem";

const meta: Meta<typeof Action> = {
  title: "Actions/Action",
  component: Action,
  render: (props) => (
    <Action {...props}>
      <Button>Button</Button>
    </Action>
  ),
  parameters: {
    controls: {
      exclude: [
        "children",
        "action",
        "closeOverlay",
        "openOverlay",
        "toggleOverlay",
        "showFeedback",
        "break",
        "skip",
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
        <ActionGroup>
          <Button color="danger">Confirm</Button>
          <Button color="secondary" variant="soft">
            Abort
          </Button>
        </ActionGroup>
      </Modal>
      <Button color="secondary" variant="soft">
        Delete customer
      </Button>
    </Action>
  ),
};

export const InContextMenu: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <Action onAction={asyncFunction}>
          <MenuItem>Async</MenuItem>
        </Action>
        <Action onAction={asyncLongFunction}>
          <MenuItem>Async Long</MenuItem>
        </Action>
        <Action onAction={asyncFunction}>
          <Action onAction={asyncFunction}>
            <MenuItem>Nested Async</MenuItem>
          </Action>
        </Action>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};
