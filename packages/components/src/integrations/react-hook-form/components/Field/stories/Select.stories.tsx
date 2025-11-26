import type { Meta, StoryObj } from "@storybook/react";
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
import Select from "@/components/Select";
import { Option } from "@/components/Option";
import { useEffect } from "react";
import { FieldError } from "@/components/FieldError";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/Select",
  component: Field,
  render: () => {
    interface Values {
      app: string;
      appDefaultValue: string;
      appRequired: string;
    }

    const handleSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        app: "",
        appDefaultValue: "wordpress",
        appRequired: "",
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleSubmit}>
        <Section>
          <Field name="app">
            <Select>
              <Label>App</Label>
              <Option value="wordpress">WordPress</Option>
              <Option value="typo3">TYPO3</Option>
              <Option value="magento">Magento</Option>
            </Select>
          </Field>

          <Field name="appDefaultValue">
            <Select>
              <Label>App</Label>
              <Option value="wordpress">WordPress</Option>
              <Option value="typo3">TYPO3</Option>
              <Option value="magento">Magento</Option>
            </Select>
          </Field>

          <Field
            name="appRequired"
            rules={{ required: "Please select an app" }}
          >
            <Select>
              <Label>App</Label>
              <Option value="wordpress">WordPress</Option>
              <Option value="typo3">TYPO3</Option>
              <Option value="magento">Magento</Option>
            </Select>
          </Field>

          <ActionGroup>
            <ResetButton>Reset</ResetButton>
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
  render: () => {
    const form = useForm();
    useEffect(() => {
      form.setError("field", {
        type: "required",
        message: "ErrorFromForm",
      });
    }, []);

    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"field"}>
          <Select>
            <Label>Field</Label>
            <Option value="wordpress">WordPress</Option>
            <Option value="typo3">TYPO3</Option>
            <Option value="magento">Magento</Option>
          </Select>
        </Field>
        <Select isInvalid>
          <Label>Field</Label>
          <Option value="wordpress">WordPress</Option>
          <Option value="typo3">TYPO3</Option>
          <Option value="magento">Magento</Option>
          <FieldError>ErrorFromOuterFieldError!</FieldError>
        </Select>
      </Form>
    );
  },
};

export const WithFocus: Story = {
  render: () => {
    const form = useForm();
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"field"}>
          <Select>
            <Label>Field</Label>
            <Option value="wordpress">WordPress</Option>
            <Option value="typo3">TYPO3</Option>
            <Option value="magento">Magento</Option>
          </Select>
        </Field>
        <div style={{ marginBottom: "2200px" }} />
        <Button
          onPress={() =>
            form.setError(
              "field",
              { type: "required", message: "oh no" },
              { shouldFocus: true },
            )
          }
        >
          err through form
        </Button>
        <Button onPress={() => form.setFocus("field")}>
          focus through form
        </Button>
        <ResetButton>Reset</ResetButton>
        <SubmitButton>Submit</SubmitButton>
      </Form>
    );
  },
};
