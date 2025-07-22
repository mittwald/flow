"use client";

import {
  ActionGroup,
  Button,
  CopyButton,
  ComboBox,
  FileField,
  Label,
  Option,
  Section,
  Select,
  TextArea,
  TextField,
  PasswordCreationField,
  Autocomplete,
  ContextMenu,
  MenuItem,
} from "@mittwald/flow-remote-react-components";
import {
  Form,
  Field,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import { useForm } from "react-hook-form";

export default function Page() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "foo.bar@",
      confirm: false,
      age: 20,
      comment: "",
      city: "Minden",
      city2: "Minden",
      file: [],
      password: "",
    },
  });

  const password = form.watch("password");

  return (
    <Section>
      <Form
        form={form}
        onSubmit={async (data) => {
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
            <ContextMenu>
              <MenuItem textValue="Foo" id="Foo">
                Foo
              </MenuItem>
              <MenuItem textValue="Bar" id="Bar">
                Bar
              </MenuItem>
            </ContextMenu>
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
            <Option value="Minden" textValue="Minden">
              Minden
            </Option>
            <Option value="Espelkamp" textValue="Espelkamp">
              Espelkamp
            </Option>
          </ComboBox>
        </Field>
        <Field name="city2">
          <Select>
            <Label>City</Label>
            <Option value="Minden" textValue="Minden">
              Minden
            </Option>
            <Option value="Espelkamp" textValue="Espelkamp">
              Espelkamp
            </Option>
          </Select>
        </Field>
        <Field name="password" rules={{ required: true }}>
          <PasswordCreationField>
            <Label>Password</Label>
            <CopyButton text={password} />
          </PasswordCreationField>
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
          <Button type="submit">Login</Button>
          <Button
            onPress={() => {
              form.setValue("email", "demo@test.de");
            }}
          >
            Set value
          </Button>
          <Button
            onPress={() => {
              form.reset();
            }}
          >
            Reset
          </Button>
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
