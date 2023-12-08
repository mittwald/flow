import type { Meta, StoryObj } from "@storybook/react";
import RadioGroup from "../RadioGroup";
import Radio from "../components/Radio";

const meta: Meta<typeof RadioGroup> = {
  title: "RadioGroup",
  component: RadioGroup,
  args: { defaultValue: "a" },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
        <Radio value="c">C</Radio>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    children: (
      <>
        <Radio isDisabled value="a">
          A
        </Radio>
        <Radio isDisabled value="b">
          B
        </Radio>
        <Radio isDisabled value="c">
          C
        </Radio>
      </>
    ),
  },
};

export const WithDescription: Story = {
  args: {
    children: (
      <>
        <Radio value="a" description="Beschreibung...">
          A
        </Radio>
        <Radio value="b" description="Beschreibung...">
          B
        </Radio>
        <Radio value="c" description="Beschreibung...">
          C
        </Radio>
      </>
    ),
  },
};
