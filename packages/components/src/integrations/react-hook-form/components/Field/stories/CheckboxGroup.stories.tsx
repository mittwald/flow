import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Label } from "@/components/Label";
import {
  Field,
  Form,
  ResetButton,
  SubmitButton,
  typedField,
} from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { Checkbox } from "@/components/Checkbox";
import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/CheckboxGroup",
  component: Field,
  render: () => {
    interface Values {
      interests: string[];
      interestsDefaultValue: string[];
      interestsRequired: string[];
      interestsMaxValue: string[];
    }

    const handleSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        interests: [],
        interestsDefaultValue: ["foo"],
        interestsRequired: [],
        interestsMaxValue: [],
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleSubmit}>
        <Section>
          <Field name="interests">
            <CheckboxGroup>
              <Label>Favorite planets</Label>
              <Checkbox value="foo">Tatooine</Checkbox>
              <Checkbox value="bar">Hoth</Checkbox>
              <Checkbox value="baz">Endor</Checkbox>
            </CheckboxGroup>
          </Field>

          <Field name="interestsDefaultValue">
            <CheckboxGroup>
              <Label>Favorite planets</Label>
              <Checkbox value="foo">Tatooine</Checkbox>
              <Checkbox value="bar">Hoth</Checkbox>
              <Checkbox value="baz">Endor</Checkbox>
            </CheckboxGroup>
          </Field>

          <Field
            name="interestsRequired"
            rules={{
              validate: {
                min: (val) =>
                  Array.isArray(val) && val.length > 0
                    ? true
                    : "Check at least 1 item",
              },
            }}
          >
            <CheckboxGroup>
              <Label>Favorite planets</Label>
              <Checkbox value="foo">Tatooine</Checkbox>
              <Checkbox value="bar">Hoth</Checkbox>
              <Checkbox value="baz">Endor</Checkbox>
              <FieldDescription>Check at least 1 item</FieldDescription>
            </CheckboxGroup>
          </Field>

          <Field
            name="interestsMaxValue"
            rules={{
              validate: {
                max: (val) =>
                  Array.isArray(val) && val.length < 3
                    ? true
                    : "Check max 2 items",
              },
            }}
          >
            <CheckboxGroup>
              <Label>Favorite planets</Label>
              <Checkbox value="foo">Tatooine</Checkbox>
              <Checkbox value="bar">Hoth</Checkbox>
              <Checkbox value="baz">Endor</Checkbox>
              <FieldDescription>Check max 2 items</FieldDescription>
            </CheckboxGroup>
          </Field>

          <ActionGroup>
            <ResetButton slot="abort">Reset</ResetButton>
            <SubmitButton>Submit</SubmitButton>
          </ActionGroup>
        </Section>
      </Form>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {};

export const WithFieldError: Story = {
  render: (props) => {
    const form = useForm();
    useEffect(() => {
      form.setError("field", {
        type: "required",
        message: "ErrorFromForm",
      });
    }, []);

    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Section>
          <Field name="field">
            <CheckboxGroup l={[1, 1, 1]} m={[1, 1]} {...props}>
              <Label>Star systems</Label>
              <Checkbox value="1">Tatooine</Checkbox>
              <Checkbox value="2">Hoth</Checkbox>
              <Checkbox value="3">Endor</Checkbox>
              <Checkbox value="4">Naboo</Checkbox>
              <Checkbox value="5">Coruscant</Checkbox>
              <Checkbox value="6">Dagobah</Checkbox>
            </CheckboxGroup>
          </Field>
          <CheckboxGroup l={[1, 1, 1]} m={[1, 1]} isInvalid {...props}>
            <Label>Star systems</Label>
            <Checkbox value="1">Tatooine</Checkbox>
            <Checkbox value="2">Hoth</Checkbox>
            <Checkbox value="3">Endor</Checkbox>
            <Checkbox value="4">Naboo</Checkbox>
            <Checkbox value="5">Coruscant</Checkbox>
            <Checkbox value="6">Dagobah</Checkbox>
            <FieldError>ErrorFromOuterFieldError!</FieldError>
          </CheckboxGroup>
        </Section>
      </Form>
    );
  },
};

export const WithFocus: Story = {
  render: (props) => {
    const form = useForm();
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name="field">
          <CheckboxGroup l={[1, 1, 1]} m={[1, 1]} {...props}>
            <Label>Star systems</Label>
            <Checkbox value="1">Tatooine</Checkbox>
            <Checkbox value="2">Hoth</Checkbox>
            <Checkbox value="3">Endor</Checkbox>
            <Checkbox value="4">Naboo</Checkbox>
            <Checkbox value="5">Coruscant</Checkbox>
            <Checkbox value="6">Dagobah</Checkbox>
          </CheckboxGroup>
        </Field>
        <div style={{ marginBottom: "2200px" }} />
        <ActionGroup>
          <Button
            variant="soft"
            color="secondary"
            slot="secondary"
            onPress={() =>
              form.setError(
                "field",
                { type: "required", message: "oh no" },
                { shouldFocus: true },
              )
            }
          >
            Error through form
          </Button>
          <Button
            variant="soft"
            color="secondary"
            slot="secondary"
            onPress={() => form.setFocus("field")}
          >
            Focus through form
          </Button>
          <ResetButton slot="abort">Reset</ResetButton>
          <SubmitButton>Submit</SubmitButton>
        </ActionGroup>
      </Form>
    );
  },
};
