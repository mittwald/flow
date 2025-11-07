"use client";

import {
  ActionGroup,
  Button,
  CopyButton,
  ComboBox,
  FileField,
  Label,
  Option,
  MarkdownEditor,
  Section,
  Select,
  TextArea,
  TextField,
  PasswordCreationField,
  Autocomplete,
} from "@mittwald/flow-remote-react-components";
import {
  Form,
  Field,
  SubmitButton,
  ResetButton,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import {
  Policy,
  generatePasswordCreationFieldValidation,
  RuleType,
} from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { useForm } from "react-hook-form";

const customPolicy = Policy.fromDeclaration({
  minComplexity: 1,
  rules: [
    {
      ruleType: RuleType.length,
      min: 2,
      max: 5,
    },
  ],
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Page() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "foo",
      confirm: false,
      age: 20,
      comment: "",
      message: "",
      city: "Minden",
      city2: "Minden",
      file: [],
      password: "",
    },
  });

  return (
    <Section>
      <Form
        form={form}
        onSubmit={async (data) => {
          await sleep(5000);
          const files = await Promise.all(
            Array.from(data.file).map(async (f: File) => ({
              name: f.name,
              resolvedArrayBufferLength: (await f.arrayBuffer()).byteLength,
            })),
          );
          console.log("Submitted:", data, "Files:", files);
        }}
      >
        <Field
          name="name"
          rules={{
            required: "Required!",
          }}
        >
          <TextField>
            <Label>Name</Label>
          </TextField>
        </Field>
        <Field
          name="email"
          rules={{
            required: "Required!",
          }}
        >
          <Autocomplete>
            <TextField>
              <Label>Email</Label>
            </TextField>
            <Option>Foo</Option>
            <Option>Bar</Option>
          </Autocomplete>
        </Field>
        <Field name="comment">
          <TextArea maxLength={100}>
            <Label>Comment</Label>
          </TextArea>
        </Field>
        <Field name="city">
          <ComboBox>
            <Label>City</Label>
            <Option>Minden</Option>
            <Option>Espelkamp</Option>
          </ComboBox>
        </Field>
        <Field name="city2">
          <Select>
            <Label>City</Label>
            <Option>Minden</Option>
            <Option>Espelkamp</Option>
          </Select>
        </Field>
        <Field
          name="password"
          rules={{
            required: true,
            validate: generatePasswordCreationFieldValidation(customPolicy),
          }}
        >
          <PasswordCreationField validationPolicy={customPolicy}>
            <Label>Password</Label>
            <CopyButton />
          </PasswordCreationField>
        </Field>
        <Field name="message">
          <MarkdownEditor>
            <Label>Message</Label>
          </MarkdownEditor>
        </Field>
        <Field name="file">
          <FileField>
            <Label>Zertifikat</Label>
            <Button variant="outline" color="secondary">
              Auswählen
            </Button>
          </FileField>
        </Field>
        <ActionGroup>
          <SubmitButton>Submit</SubmitButton>
          <Button
            onPress={() => {
              form.setValue("email", "demo@test.de");
            }}
          >
            Set value
          </Button>
          <ResetButton>Reset</ResetButton>
          <Button
            onPress={() => {
              form.reset({
                email: "resetted@test.de",
              });
            }}
          >
            Reset with value
          </Button>
          <Button type="reset">Native Reset</Button>
        </ActionGroup>
      </Form>
    </Section>
  );
}
