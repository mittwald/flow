import type { Meta, StoryObj } from "@storybook/react";
import RadioGroup from "../RadioGroup";
import Radio from "../components/Radio";
import { Icon } from "@/components";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";
import { Description } from "@/components/Description";
import { AdditionalInfo } from "@/components/AdditionalInfo";
import { Text } from "@/components/Text";

const meta: Meta<typeof RadioGroup> = {
  title: "RadioGroup/Variants",
  component: RadioGroup,
  args: { defaultValue: "a" },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const TitleOnly: Story = {
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

export const WithDescription: Story = {
  args: {
    children: (
      <>
        <Radio value="a">
          <Text>Option A</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
        </Radio>
        <Radio value="b">
          <Text>Option B</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
        </Radio>
        <Radio value="c">
          <Text>Option C</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
        </Radio>
      </>
    ),
  },
};

export const WithIconAndDescription: Story = {
  args: {
    children: (
      <>
        <Radio value="a">
          <Icon faIcon={faStar} />
          <Text>Option A</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
        </Radio>
        <Radio value="b">
          <Icon faIcon={faStar} />
          <Text>Option B</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
        </Radio>
        <Radio value="c">
          <Icon faIcon={faStar} />
          <Text>Option C</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
        </Radio>
      </>
    ),
  },
};

export const WithAdditionalInfo: Story = {
  args: {
    children: (
      <>
        <Radio value="a">
          <Text>Option A</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
          <AdditionalInfo>Additional info</AdditionalInfo>
        </Radio>
        <Radio value="b">
          <Text>Option B</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
          <AdditionalInfo>Additional info</AdditionalInfo>
        </Radio>
        <Radio value="c">
          <Text>Option C</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
          <AdditionalInfo>Additional info</AdditionalInfo>
        </Radio>
      </>
    ),
  },
};

export const WithIconAndAdditionalInfo: Story = {
  args: {
    children: (
      <>
        <Radio value="a">
          <Icon faIcon={faStar} />
          <Text>Option A</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
          <AdditionalInfo>Additional info</AdditionalInfo>
        </Radio>
        <Radio value="b">
          <Icon faIcon={faStar} />
          <Text>Option B</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
          <AdditionalInfo>Additional info</AdditionalInfo>
        </Radio>
        <Radio value="c">
          <Icon faIcon={faStar} />
          <Text>Option C</Text>
          <Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Description>
          <AdditionalInfo>Additional info</AdditionalInfo>
        </Radio>
      </>
    ),
  },
};
