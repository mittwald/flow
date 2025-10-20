import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { action } from "storybook/actions";
import { Field } from "@/integrations/react-hook-form";
import { Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { sleep } from "@/lib/promises/sleep";
import { Autocomplete } from "@/components/Autocomplete";
import { Label } from "@/components/Label";
import { TextField } from "@/components/TextField";
import Option from "@/components/Option";
import { SearchField } from "@/components/SearchField";

const submitAction = action("submit");

const generateFromString = (value: string) => {
  return ["example.com", "test.org", "email.net", "mail.com"].map((d) => {
    const email = `${value.split("@")[0]}@${d}`;
    return (
      <Option key={email} value={email} textValue={email}>
        {email}
      </Option>
    );
  });
};

const meta: Meta<typeof Autocomplete> = {
  title: "Integrations/React Hook Form/Autocomplete",
  component: Autocomplete,
  render: () => {
    interface Values {
      email: string;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        email: "",
      },
    });

    const Field = typedField(form);
    const email = form.watch("email");

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field name="email">
            <Autocomplete>
              <TextField>
                <Label>Test</Label>
              </TextField>
              {generateFromString(email)}
            </Autocomplete>
          </Field>
          <ActionGroup>
            <Button onPress={() => form.reset()}>Reset</Button>
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

export const WithFocusAndError: Story = {
  render: () => {
    const form = useForm();

    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Field name={"text"} rules={{ required: true }}>
          <Autocomplete>
            <SearchField>
              <Label>Test</Label>
            </SearchField>
            <Option value="example.com">example.com</Option>
            <Option value="domain.de">domain.de</Option>
            <Option value="test.org">test.org</Option>
          </Autocomplete>
        </Field>
        <div style={{ marginBottom: "2200px" }} />
        <Button
          onPress={() =>
            form.setError(
              "text",
              { type: "required", message: "oh no" },
              { shouldFocus: true },
            )
          }
        >
          err through form
        </Button>
        <Button onPress={() => form.setFocus("text")}>
          focus through form
        </Button>
        <Button type="submit">Submit</Button>
      </Form>
    );
  },
};
