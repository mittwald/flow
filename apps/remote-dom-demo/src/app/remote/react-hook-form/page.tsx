"use client";

import {
  ActionGroup,
  Autocomplete,
  Button,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  CopyButton,
  FileField,
  Label,
  MarkdownEditor,
  Option,
  PasswordCreationField,
  Section,
  Select,
  TextArea,
  TextField,
} from "@mittwald/flow-remote-react-components";
import {
  Field,
  type FieldPropsComponent,
  Form,
  ResetButton,
  SubmitButton,
  useFieldProps,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import {
  generatePasswordCreationFieldValidation,
  Policy,
  RuleType,
} from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { useForm } from "react-hook-form";
import type { FC } from "react";

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

const CustomFieldComponent: FC<FieldPropsComponent> = (props) => {
  const {
    children,
    value,
    onBlur,
    fieldComponents: {
      FieldErrorView,
      FieldComponentContainer,
      FieldChildrenContainer,
    },
  } = useFieldProps(props);

  return (
    <FieldComponentContainer>
      <FieldChildrenContainer>
        <CheckboxGroup
          value={value}
          onBlur={onBlur}
          onChange={(v) => console.log("change", v)}
        >
          <Checkbox value="read">Lesen</Checkbox>
          <Checkbox value="write">Schreiben</Checkbox>
        </CheckboxGroup>
        {children}
      </FieldChildrenContainer>
      <FieldErrorView />
    </FieldComponentContainer>
  );
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Page() {
  const form = useForm({
    defaultValues: {
      name: "",
      account: "p1122",
      confirm: false,
      age: 20,
      comment: "",
      message: "",
      city: "Minden",
      city2: "Minden",
      file: [],
      password: "",
      permissions: [],
      agreeTerms: false,
      email: "asd@asd.de",
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
          return () => {
            console.log("After submit callback");
          };
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
          name="account"
          rules={{
            required: "Required!",
          }}
        >
          <Autocomplete>
            <TextField showCharacterCount>
              <Label>Account</Label>
            </TextField>
            <Option>p1234</Option>
            <Option>p1122</Option>
            <Option>p4567</Option>
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
        <Field name="permissions" rules={{ required: "yes" }}>
          <CustomFieldComponent>
            <Label>Berechtigungen</Label>
          </CustomFieldComponent>
        </Field>
        <Field name="agreeTerms">
          <Label>Terms</Label>
          <Checkbox value="true">Verstanden!</Checkbox>
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
