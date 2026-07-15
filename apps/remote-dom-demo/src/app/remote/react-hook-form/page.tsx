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
  DateRangePicker,
  PasswordCreationField,
  Autocomplete,
  CheckboxGroup,
  TranslationProvider,
  Checkbox,
} from "@mittwald/flow-remote-react-components";
import {
  Form,
  Field,
  SubmitButton,
  ResetButton,
  useFormSubmitController,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import {
  Policy,
  generatePasswordCreationFieldValidation,
  RuleType,
} from "@mittwald/flow-react-components/password-tools";
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Page() {
  const form = useForm({
    defaultValues: {
      name: "",
      dateRange: [],
      account: "Rogue Squadron",
      confirm: false,
      email: "",
      age: 20,
      comment: "",
      message: "",
      city: "Tatooine",
      city2: "Tatooine",
      file: [],
      password: "",
      permissions: [],
      agreeTerms: false,
    },
  });

  const submitController = useFormSubmitController();

  return (
    <Section>
      <Form
        submitController={submitController}
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
            <Label>Mission name</Label>
          </TextField>
        </Field>
        <Field name="dateRange">
          <DateRangePicker withDatePickerPresets>
            <Label>Date range</Label>
          </DateRangePicker>
        </Field>
        <TranslationProvider
          translations={{
            "en-US": {
              Label: {
                optional: "(Translated via TranslationProvider -Optional-)",
              },
            },
          }}
        >
          <Field name="email">
            <TextField>
              <Label>Email</Label>
            </TextField>
          </Field>
        </TranslationProvider>
        <Field
          name="account"
          rules={{
            required: "Required!",
          }}
        >
          <Autocomplete>
            <TextField showCharacterCount>
              <Label>Squadron</Label>
            </TextField>
            <Option>Rogue Squadron</Option>
            <Option>Red Squadron</Option>
            <Option>Gold Squadron</Option>
          </Autocomplete>
        </Field>
        <Field name="comment">
          <TextArea maxLength={100}>
            <Label>Notes</Label>
          </TextArea>
        </Field>
        <Field name="city">
          <ComboBox>
            <Label>Homeworld</Label>
            <Option>Tatooine</Option>
            <Option>Alderaan</Option>
          </ComboBox>
        </Field>
        <Field name="city2">
          <Select>
            <Label>Homeworld</Label>
            <Option>Tatooine</Option>
            <Option>Alderaan</Option>
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
            <Label>Release notes</Label>
          </MarkdownEditor>
        </Field>
        <Field name="file">
          <FileField>
            <Label>Holocron</Label>
            <Button variant="outline" color="secondary">
              Choose
            </Button>
          </FileField>
        </Field>
        <Field name="permissions">
          <CheckboxGroup>
            <Label>Clearance</Label>
            <Checkbox value="archives">Jedi Archives</Checkbox>
            <Checkbox value="command">Command deck</Checkbox>
          </CheckboxGroup>
        </Field>
        <Field name="agreeTerms">
          <Label>Terms</Label>
          <Checkbox value="true">I agree!</Checkbox>
        </Field>
        <ActionGroup>
          <SubmitButton>SubmitButton</SubmitButton>
          <Button onPress={() => submitController.submit()}>
            SubmitController
          </Button>
          <Button
            onPress={() => {
              form.setValue("email", "leia@rebel-alliance.com");
            }}
          >
            Set value
          </Button>
          <ResetButton>Reset</ResetButton>
          <Button
            onPress={() => {
              form.reset({
                email: "han@rebel-alliance.com",
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
