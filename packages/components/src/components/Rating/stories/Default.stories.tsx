import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Rating } from "@/components/Rating";
import { Label } from "@/components/Label";
import { FieldError } from "@/components/FieldError";
import { useForm } from "react-hook-form";
import { Form, SubmitButton, typedField } from "@/integrations/react-hook-form";
import { Icon } from "@/components/Icon";
import {
  IconLeaf,
  IconLeafFilled,
  IconMoodEmpty,
  IconMoodEmptyFilled,
  IconMoodHappy,
  IconMoodHappyFilled,
  IconMoodSad,
  IconMoodSadFilled,
} from "@tabler/icons-react";
import { RatingSegment } from "@/components/Rating/components/RatingSegment";

const meta: Meta<typeof Rating> = {
  title: "Form Controls/Rating",
  component: Rating,
  args: {
    size: "m",
    maxValue: 5,
    fill: "cumulative",
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["s", "m"] },
    fill: { control: "inline-radio", options: ["cumulative", "single"] },
    maxValue: { control: { type: "number", min: 1, max: 12 } },
  },
  parameters: {
    controls: { exclude: ["iconEmpty", "iconFilled"] },
  },
  render: (props) => (
    <Rating defaultValue={2} {...props}>
      <Label>Cantina rating</Label>
    </Rating>
  ),
};

export default meta;

type Story = StoryObj<typeof Rating>;

export const Default: Story = {};

export const WithFieldError: Story = {
  render: (props) => (
    <Rating {...props} defaultValue={0} isInvalid isRequired>
      <Label>Cantina rating</Label>
      <FieldError>Please rate the cantina</FieldError>
    </Rating>
  ),
};

export const WithControlledValue: Story = {
  render: (props) => {
    const [value, setValue] = useState(4);

    return (
      <Rating {...props} value={value} onChange={(v) => setValue(parseInt(v))}>
        <Label>Cantina rating</Label>
      </Rating>
    );
  },
};

export const WithForm: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const form = useForm<{ rating: number }>({ defaultValues: { rating: 2 } });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={async (v) => console.log(v.rating)}>
        <Field name="rating">
          <Rating>
            <Label>Cantina rating</Label>
          </Rating>
        </Field>
        <br />
        <SubmitButton>Submit</SubmitButton>
      </Form>
    );
  },
};
export const WithCustomIcon: Story = {
  args: {
    iconEmpty: (
      <Icon>
        <IconLeaf />
      </Icon>
    ),
    iconFilled: (
      <Icon color="success">
        <IconLeafFilled />
      </Icon>
    ),
  },
};

export const WithSegments: Story = {
  args: { fill: "single" },
  // The segments define how many there are, so maxValue has no effect here.
  parameters: {
    controls: { exclude: ["iconEmpty", "iconFilled", "maxValue"] },
  },
  render: (props) => (
    <Rating {...props} defaultValue={3}>
      <Label>How was your stay on Tatooine?</Label>
      <RatingSegment
        aria-label="Terrible"
        iconEmpty={
          <Icon>
            <IconMoodSad />
          </Icon>
        }
        iconFilled={
          <Icon color="danger">
            <IconMoodSadFilled />
          </Icon>
        }
      />
      <RatingSegment
        aria-label="Okay"
        iconEmpty={
          <Icon>
            <IconMoodEmpty />
          </Icon>
        }
        iconFilled={
          <Icon color="warning">
            <IconMoodEmptyFilled />
          </Icon>
        }
      />
      <RatingSegment
        aria-label="Great"
        iconEmpty={
          <Icon>
            <IconMoodHappy />
          </Icon>
        }
        iconFilled={
          <Icon color="success">
            <IconMoodHappyFilled />
          </Icon>
        }
      />
    </Rating>
  ),
};
