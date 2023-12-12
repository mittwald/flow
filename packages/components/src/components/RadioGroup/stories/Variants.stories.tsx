import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import { Icon } from "@/components";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import React from "react";

const meta: Meta<typeof RadioGroup> = {
  title: "RadioGroup/Variants",
  component: RadioGroup,
  args: { defaultValue: "a" },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Radio value="a">
          <Text>Option A</Text>
        </Radio>
        <Radio value="b">
          <Text>Option B</Text>
        </Radio>
        <Radio value="c">
          <Text>Option C</Text>
        </Radio>
      </>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Radio value="a">
          <Icon faIcon={faStar} />
          <Text>Option A</Text>
        </Radio>
        <Radio value="b">
          <Icon faIcon={faStar} />
          <Text>Option B</Text>
        </Radio>
        <Radio value="c">
          <Icon faIcon={faStar} />
          <Text>Option C</Text>
        </Radio>
      </>
    ),
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <>
        <Radio value="a">
          <Text>Option A</Text>
          <Content>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Content>
        </Radio>
        <Radio value="b">
          <Text>Option B</Text>
          <Content>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Content>
        </Radio>
        <Radio value="c">
          <Text>Option C</Text>
          <Content>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Content>
        </Radio>
      </>
    ),
  },
};

export const WithIconAndContent: Story = {
  args: {
    children: (
      <>
        <Radio value="a">
          <Icon faIcon={faStar} />
          <Text>Option A</Text>
          <Content>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Content>
        </Radio>
        <Radio value="b">
          <Icon faIcon={faStar} />
          <Text>Option B</Text>
          <Content>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Content>
        </Radio>
        <Radio value="c">
          <Icon faIcon={faStar} />
          <Text>Option C</Text>
          <Content>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Content>
        </Radio>
      </>
    ),
  },
};
