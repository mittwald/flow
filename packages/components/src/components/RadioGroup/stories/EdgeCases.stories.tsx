import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "../index";
import { Icon } from "@/components";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import React from "react";

const meta: Meta<typeof RadioGroup> = {
  title: "RadioGroup/EdgeCases",
  component: RadioGroup,
  args: { defaultValue: "a" },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const LongTexts: Story = {
  args: {
    children: (
      <>
        <Radio value="a">
          <Icon faIcon={faStar} />
          <Text>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </Text>
          <Content>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
          </Content>
        </Radio>
        <Radio value="b">
          <Icon faIcon={faStar} />
          <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>
          <Content>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
          </Content>
        </Radio>
        <Radio value="c">
          <Icon faIcon={faStar} />
          <Text>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </Text>
          <Content>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
          </Content>
        </Radio>
      </>
    ),
  },
};

export const MultipleElements: Story = {
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
        <Radio value="d">
          <Icon faIcon={faStar} />
          <Text>Option A</Text>
          <Content>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Content>
        </Radio>
        <Radio value="e">
          <Icon faIcon={faStar} />
          <Text>Option B</Text>
          <Content>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Content>
        </Radio>
        <Radio value="f">
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
