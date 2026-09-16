<script>
  import {
    Button,
    Checkbox,
    CheckboxGroup,
    CodeBlock,
    FileField,
    Form,
    Label,
    Option,
    Section,
    Select,
    Text,
    TextField,
  } from "@mittwald/flow-remote-svelte-components";

  /*
   * The React page submits to a Next server action and reads `useActionState` /
   * `useFormStatus`. Both are React's own form plumbing, so this version does
   * the same thing by hand: an async submit, a pending flag, a call counter.
   */
  let isPending = $state(false);
  let callCount = $state(0);
  let submitted = $state(undefined);

  const submit = async (data) => {
    isPending = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    callCount++;
    submitted = [...data.entries()].map(([name, value]) => ({
      name,
      value: value instanceof File ? value.name : value,
    }));
    isPending = false;
  };
</script>

<Form onSubmit={(data) => void submit(data)}>
  <Section>
    <CheckboxGroup name="check">
      <Label>Clearance</Label>
      <Checkbox value="archives">Jedi Archives</Checkbox>
      <Checkbox value="command">Command deck</Checkbox>
    </CheckboxGroup>
    <Select name="select" aria-label="Homeworld">
      <Option value="Tatooine" textValue="Tatooine">Tatooine</Option>
      <Option value="Alderaan" textValue="Alderaan">Alderaan</Option>
      <Option value="Hoth" textValue="Hoth">Hoth</Option>
    </Select>
    <TextField name="test" aria-label="Mission name" />
    <FileField multiple={true} name="certificates">
      <Label>Holocrons</Label>
      <Button variant="outline" color="secondary">Choose</Button>
    </FileField>
    <Button type="submit" {isPending}>Submit</Button>
    <Text>Called {callCount} times</Text>
    <CodeBlock code={JSON.stringify({ isPending, submitted }, undefined, 2)} />
  </Section>
</Form>
