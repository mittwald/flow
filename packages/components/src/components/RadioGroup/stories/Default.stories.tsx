import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import React from "react";
import { Content } from "@/components/Content";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { Icon } from "@/components/Icon";

const meta: Meta<typeof RadioGroup> = {
  title: "RadioGroup",
  component: RadioGroup,
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    defaultValue: "admin",
    children: (
      <>
        <Label>Role</Label>
        <Radio value="admin">
          <Text>Admin</Text>
        </Radio>
        <Radio value="member">
          <Text>Member</Text>
        </Radio>
        <Radio value="accountant">
          <Text>Accountant</Text>
        </Radio>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: "admin",
    isDisabled: true,
    children: (
      <>
        <Label>Role</Label>
        <Radio value="admin">
          <Text>Admin</Text>
        </Radio>
        <Radio value="member">
          <Text>Member</Text>
        </Radio>
        <Radio value="accountant">
          <Text>Accountant</Text>
        </Radio>
      </>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    defaultValue: "wordpress",
    children: (
      <>
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
      </>
    ),
  },
};

export const WithContent: Story = {
  args: {
    "aria-label": "domain",
    defaultValue: "domain",
    children: (
      <>
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
            The domain remains with your previous provider, but you can use it
            for your website in our mStudio.
          </Content>
        </Radio>
        <Radio value="subdomain">
          <Text>Add subdomain</Text>
          <Content>
            Create a subdomain from an existing domain to use for your project.
          </Content>
        </Radio>
      </>
    ),
  },
};

export const WithIconAndContent: Story = {
  args: {
    "aria-label": "project",
    defaultValue: "proSpace",
    children: (
      <>
        <Radio value="proSpace">
          <Icon faIcon={faStar} />
          <Text>proSpace</Text>
          <Content>
            The proSpace guarantees your project its own resources, also
            dedicated if desired.
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
      </>
    ),
  },
};
