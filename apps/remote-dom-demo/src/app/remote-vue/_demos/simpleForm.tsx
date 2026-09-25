/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Autocomplete,
  Button,
  Checkbox,
  CheckboxGroup,
  CodeBlock,
  FileField,
  Form,
  Label,
  Option,
  Radio,
  RadioGroup,
  Section,
  Select,
  TextField,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, ref } from "vue";

/**
 * The Vue counterpart of `/remote/simple-form`.
 *
 * `onSubmit` receives the `FormData` the host collected — the payload crosses
 * the boundary as data, so the extension never touches the host's DOM. The
 * uploaded files arrive as real `File`s, which is what reading their byte
 * length below demonstrates.
 */
export const SimpleFormDemo = defineComponent({
  name: "SimpleFormDemo",
  setup() {
    const submitted = ref<unknown>();

    const onSubmit = async (data: FormData) => {
      submitted.value = {
        data: Array.from(data.entries()),
        certificates: await Promise.all(
          (data.getAll("certificates") as File[]).map(async (file) => ({
            name: file.name,
            resolvedDataLengthFromArrayBuffer: (await file.arrayBuffer())
              .byteLength,
          })),
        ),
      };
    };

    return () => (
      <Form onSubmit={onSubmit}>
        <Section>
          <CheckboxGroup name="check">
            <Label>Clearance</Label>
            <Checkbox value="archives">Jedi Archives</Checkbox>
            <Checkbox value="command">Command deck</Checkbox>
          </CheckboxGroup>
          <RadioGroup name="role" defaultValue="admin">
            <Label>Rank</Label>
            <Radio value="admin">Commander</Radio>
            <Radio value="member">Pilot</Radio>
            <Radio value="accountant">Engineer</Radio>
          </RadioGroup>
          <Autocomplete>
            <TextField name="text" aria-label="Homeworld" />
            <Option textValue="Tatooine" value="Tatooine">
              Tatooine
            </Option>
            <Option textValue="Alderaan" value="Alderaan">
              Alderaan
            </Option>
          </Autocomplete>
          <Select name="select" aria-label="Homeworld">
            <Option value="Tatooine" textValue="Tatooine">
              Tatooine
            </Option>
            <Option value="Alderaan" textValue="Alderaan">
              Alderaan
            </Option>
            <Option value="Hoth" textValue="Hoth">
              Hoth
            </Option>
          </Select>
          <FileField multiple name="certificates">
            <Label>Holocrons</Label>
            <Button variant="outline" color="secondary">
              Choose
            </Button>
          </FileField>
          <Button type="submit">Submit</Button>
          <CodeBlock code={JSON.stringify(submitted.value, undefined, 2)} />
        </Section>
      </Form>
    );
  },
});
