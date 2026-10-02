<script>
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
  } from "@mittwald/flow-remote-svelte-components";

  let event = $state(undefined);

  /*
   * The React page reads the `FormData` the host collected, files included.
   * Same here — the submit handler is a plain function, and the files arrive as
   * `File` objects that crossed the boundary.
   */
  const submit = async (data) => {
    event = {
      data: [...data.entries()].map(([name, value]) => [
        name,
        value instanceof File ? value.name : value,
      ]),
      certificates: await Promise.all(
        data.getAll("certificates").map(async (file) => ({
          name: file.name,
          resolvedDataLengthFromArrayBuffer: (await file.arrayBuffer())
            .byteLength,
        })),
      ),
    };
  };
</script>

<Form onSubmit={(data) => void submit(data)}>
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
      <Option textValue="Tatooine" value="Tatooine">Tatooine</Option>
      <Option textValue="Alderaan" value="Alderaan">Alderaan</Option>
    </Autocomplete>
    <Select name="select" aria-label="Homeworld">
      <Option value="Tatooine" textValue="Tatooine">Tatooine</Option>
      <Option value="Alderaan" textValue="Alderaan">Alderaan</Option>
      <Option value="Hoth" textValue="Hoth">Hoth</Option>
    </Select>
    <FileField multiple={true} name="certificates">
      <Label>Holocrons</Label>
      <Button variant="outline" color="secondary">Choose</Button>
    </FileField>
    <Button type="submit">Submit</Button>
    <CodeBlock code={JSON.stringify(event, undefined, 2)} />
  </Section>
</Form>
