import type { Meta, StoryObj } from "@storybook/react";
import ButtonGroup from "../ButtonGroup";
import React from "react";
import { Button } from "@/components/Button";

const meta: Meta<typeof ButtonGroup> = {
  title: "Actions/ButtonGroup",
  component: ButtonGroup,
  render: (props) => (
    <ButtonGroup {...props}>
      <Button color="accent">Create customer</Button>
      <Button variant="soft" color="secondary">
        Abort
      </Button>
    </ButtonGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {};

export const Danger: Story = {
  render: (props) => (
    <ButtonGroup {...props}>
      <Button color="danger">Delete project</Button>
      <Button variant="soft" color="secondary">
        Abort
      </Button>
    </ButtonGroup>
  ),
};

export const Info: Story = {
  render: (props) => (
    <ButtonGroup {...props}>
      <Button>Ok</Button>
    </ButtonGroup>
  ),
};

export const AdditionalSecondary: Story = {
  render: (props) => (
    <ButtonGroup {...props}>
      <Button color="accent">Add email address</Button>
      <Button variant="soft" color="secondary">
        Save and add more
      </Button>
      <Button variant="soft" color="secondary">
        Abort
      </Button>
    </ButtonGroup>
  ),
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
