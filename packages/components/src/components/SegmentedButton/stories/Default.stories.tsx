import type { Meta, StoryObj } from "@storybook/react";
import { Segment, SegmentedButton } from "../index";
import React from "react";
import { Content } from "@/components/Content";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { IconApp, IconDomain } from "@/components/Icon/components/icons";
import { action } from "@storybook/addon-actions";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof SegmentedButton> = {
  title: "Actions/SegmentedButton",
  component: SegmentedButton,
  args: {
    onChange: action("onChange"),
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <SegmentedButton {...props} defaultValue="admin">
      <Label>Role</Label>
      <Segment value="admin">Admin</Segment>
      <Segment value="member">Member</Segment>
      <Segment value="accountant">Accountant</Segment>
    </SegmentedButton>
  ),
};

export default meta;

type Story = StoryObj<typeof SegmentedButton>;

export const Default: Story = {};

export const SegmentedButtonDisabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const SegmentDisabled: Story = {
  render: (props) => (
    <SegmentedButton {...props} defaultValue="admin">
      <Label>Role</Label>
      <Segment value="admin">Admin</Segment>
      <Segment value="member" isDisabled>
        Member
      </Segment>
      <Segment value="accountant">Accountant</Segment>
    </SegmentedButton>
  ),
};

export const WithIcon: Story = {
  render: (props) => (
    <SegmentedButton {...props} defaultValue="wordpress">
      <Label>App</Label>
      <Segment value="wordpress">
        <IconApp />
        <Text>WordPress</Text>
      </Segment>
      <Segment value="typo3">
        <IconApp />
        <Text>TYPO3</Text>
      </Segment>
      <Segment value="magento">
        <IconApp />
        <Text>Magento</Text>
      </Segment>
    </SegmentedButton>
  ),
};

export const WithContent: Story = {
  render: (props) => (
    <SegmentedButton {...props} defaultValue="domain" aria-label="Domain">
      <Segment value="domain">
        <Text>Book domain</Text>
        <Content>
          Do you have a desired domain? No problem, we'll help you find the
          right domain for you.
        </Content>
      </Segment>
      <Segment value="virtualHost">
        <Text>Add virtual host</Text>
        <Content>
          The domain remains with your previous provider, but you can use it for
          your website in our mStudio.
        </Content>
      </Segment>
      <Segment value="subdomain">
        <Text>Add subdomain</Text>
        <Content>
          Create a subdomain from an existing domain to use for your project.
        </Content>
      </Segment>
    </SegmentedButton>
  ),
};

export const WithIconAndContent: Story = {
  render: (props) => (
    <SegmentedButton {...props} defaultValue="proSpace" aria-label="Project">
      <Segment value="proSpace">
        <IconDomain />
        <Text>proSpace</Text>
        <Content>
          The proSpace guarantees your project its own resources, also dedicated
          if desired.
        </Content>
      </Segment>
      <Segment value="spaceServer">
        <IconDomain />
        <Text>Space-Server</Text>
        <Content>
          On the Space-Server, this project shares resources with all projects
          on your server.
        </Content>
      </Segment>
    </SegmentedButton>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <SegmentedButton {...props} isInvalid isRequired>
      <Label>App</Label>
      <Segment value="wordpress">
        <IconApp />
        <Text>WordPress</Text>
      </Segment>
      <Segment value="typo3">
        <IconApp />
        <Text>TYPO3</Text>
      </Segment>
      <Segment value="magento">
        <IconApp />
        <Text>Magento</Text>
      </Segment>
      <FieldError>Select an app to continue</FieldError>
    </SegmentedButton>
  ),
};
