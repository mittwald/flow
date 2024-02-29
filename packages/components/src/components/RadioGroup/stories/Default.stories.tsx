import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import React from "react";
import { Content } from "@/components/Content";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { IconApp, IconDomain } from "@/components/Icon/components/icons";
import { action } from "@storybook/addon-actions";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof RadioGroup> = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  args: {
    onChange: action("onChange"),
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Role</Label>
      <Radio value="admin">Admin</Radio>
      <Radio value="member">Member</Radio>
      <Radio value="accountant">Accountant</Radio>
    </RadioGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {};

export const RadioGroupDisabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const RadioDisabled: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Role</Label>
      <Radio value="admin">Admin</Radio>
      <Radio value="member" isDisabled>
        Member
      </Radio>
      <Radio value="accountant">Accountant</Radio>
    </RadioGroup>
  ),
};

export const WithIcon: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="wordpress">
      <Label>App</Label>
      <Radio value="wordpress">
        <IconApp />
        <Text>WordPress</Text>
      </Radio>
      <Radio value="typo3">
        <IconApp />
        <Text>TYPO3</Text>
      </Radio>
      <Radio value="magento">
        <IconApp />
        <Text>Magento</Text>
      </Radio>
    </RadioGroup>
  ),
};

export const WithContent: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="domain" aria-label="Domain">
      <Radio value="domain">
        <Text>Book domain</Text>
        <Content>
          Do you have a desired domain? No problem, we'll help you find the
          right domain for you.
        </Content>
      </Radio>
      <Radio value="virtualHost">
        <Text>Add virtual host</Text>
        <Content>
          The domain remains with your previous provider, but you can use it for
          your website in our mStudio.
        </Content>
      </Radio>
      <Radio value="subdomain">
        <Text>Add subdomain</Text>
        <Content>
          Create a subdomain from an existing domain to use for your project.
        </Content>
      </Radio>
    </RadioGroup>
  ),
};

export const WithIconAndContent: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="proSpace" aria-label="Project">
      <Radio value="proSpace">
        <IconDomain />
        <Text>proSpace</Text>
        <Content>
          The proSpace guarantees your project its own resources, also dedicated
          if desired.
        </Content>
      </Radio>
      <Radio value="spaceServer">
        <IconDomain />
        <Text>Space-Server</Text>
        <Content>
          On the Space-Server, this project shares resources with all projects
          on your server.
        </Content>
      </Radio>
    </RadioGroup>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <RadioGroup {...props} isInvalid>
      <Label>App</Label>
      <Radio value="wordpress">
        <IconApp />
        <Text>WordPress</Text>
      </Radio>
      <Radio value="typo3">
        <IconApp />
        <Text>TYPO3</Text>
      </Radio>
      <Radio value="magento">
        <IconApp />
        <Text>Magento</Text>
      </Radio>
      <FieldError>Select an app to continue</FieldError>
    </RadioGroup>
  ),
};
