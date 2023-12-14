import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import React from "react";
import { Content } from "@/components/Content";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { Icon } from "@/components/Icon";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof RadioGroup> = {
  title: "RadioGroup",
  component: RadioGroup,
  args: {
    onChange: action("onChange"),
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
        <Icon faIcon={faStar} />
        <Text>WordPress</Text>
      </Radio>
      <Radio value="typo3">
        <Icon faIcon={faStar} />
        <Text>TYPO3</Text>
      </Radio>
      <Radio value="magento">
        <Icon faIcon={faStar} />
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
        <Icon faIcon={faStar} />
        <Text>proSpace</Text>
        <Content>
          The proSpace guarantees your project its own resources, also dedicated
          if desired.
        </Content>
      </Radio>
      <Radio value="spaceServer">
        <Icon faIcon={faStar} />
        <Text>Space-Server</Text>
        <Content>
          On the Space-Server, this project shares resources with all projects
          on your server.
        </Content>
      </Radio>
    </RadioGroup>
  ),
};
