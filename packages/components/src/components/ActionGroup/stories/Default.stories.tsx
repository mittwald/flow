import type { Meta, StoryObj } from "@storybook/react";
import ActionGroup from "../ActionGroup";
import { Button } from "@/components/Button";
import { Action } from "@/components/Action";
import { sleep } from "@/lib/promises/sleep";
import { Switch } from "@/components/Switch";
import { Link } from "@/components/Link";
import { useForm } from "react-hook-form";
import { Form, SubmitButton } from "@/integrations/react-hook-form";

const meta: Meta<typeof ActionGroup> = {
  title: "Actions/ActionGroup",
  component: ActionGroup,
  render: (props) => (
    <ActionGroup {...props}>
      <Action onAction={() => sleep(1500)}>
        <Button color="accent">Create customer</Button>
      </Action>
      <Action>
        <Button slot="abort" variant="soft" color="secondary">
          Abort
        </Button>
      </Action>
    </ActionGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof ActionGroup>;

export const Default: Story = {};

export const Danger: Story = {
  render: (props) => (
    <ActionGroup {...props}>
      <Button color="danger">Delete project</Button>
      <Button slot="abort" variant="soft" color="secondary">
        Abort
      </Button>
    </ActionGroup>
  ),
};

export const Info: Story = {
  render: (props) => (
    <ActionGroup {...props}>
      <Button>Ok</Button>
    </ActionGroup>
  ),
};

export const WithSecondaryAction: Story = {
  render: (props) => (
    <ActionGroup {...props}>
      <Button slot="primary" color="accent">
        Add email address
      </Button>
      <Button slot="secondary" variant="soft" color="secondary">
        Save and add more
      </Button>
      <Button slot="abort" variant="soft" color="secondary">
        Abort
      </Button>
    </ActionGroup>
  ),
};

export const WithExtraSecondaryAction: Story = {
  render: (props) => (
    <ActionGroup {...props}>
      <Button slot="primary" color="accent">
        Add email address
      </Button>
      <Button slot="secondary" variant="soft" color="secondary">
        Save and add more
      </Button>
      <Button slot="secondary" variant="soft" color="secondary">
        Save as new
      </Button>
      <Button slot="abort" variant="soft" color="secondary">
        Abort
      </Button>
    </ActionGroup>
  ),
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const WithSwitch: Story = {
  render: (props) => (
    <ActionGroup {...props}>
      <Button slot="secondary">Edit</Button>
      <Switch slot="primary">Activate</Switch>
    </ActionGroup>
  ),
};

export const WithLink: Story = {
  render: (props) => (
    <ActionGroup {...props}>
      <Link slot="abort">Forgot password?</Link>
      <Button color="accent">Login</Button>
    </ActionGroup>
  ),
};

export const WithReactHookForm: Story = {
  render: (props) => {
    const form = useForm();
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <ActionGroup {...props}>
          <SubmitButton color="accent">Submit</SubmitButton>
          <Button color="secondary" variant="soft">
            Abort
          </Button>
        </ActionGroup>
      </Form>
    );
  },
};
