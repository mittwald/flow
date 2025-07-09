import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Label } from "@/components/Label";
import { Field, Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";
import Select from "@/components/Select";
import { Option } from "@/components/Option";

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

    const handleOnSubmit = async (values: Values) => {
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
      <Form form={form} onSubmit={handleOnSubmit}>
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
            <Button
              variant="soft"
              color="secondary"
              onPress={() => {
                form.reset();
              }}
            >
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </ActionGroup>
        </Section>
      </Form>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {};
