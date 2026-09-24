/** @jsxImportSource @/app/remote-vue/_lib */
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
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, ref } from "vue";

/**
 * The Vue counterpart of `/remote/action-form`.
 *
 * The React page submits to a Next server action and reads `useActionState` /
 * `useFormStatus`. Both are React's own form plumbing, so the Vue version does
 * the same thing by hand: an async submit, a pending flag, a call counter.
 */
export const ActionFormDemo = defineComponent({
  name: "ActionFormDemo",
  setup() {
    const isPending = ref(false);
    const callCount = ref(0);
    const submitted = ref<unknown>();

    const submit = async (data: FormData) => {
      isPending.value = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      callCount.value++;
      submitted.value = Array.from(data.entries()).map(([name, value]) => ({
        name,
        value: value instanceof File ? value.name : value,
      }));
      isPending.value = false;
    };

    return () => (
      <Form onSubmit={(data: FormData) => void submit(data)}>
        <Section>
          <CheckboxGroup name="check">
            <Label>Clearance</Label>
            <Checkbox value="archives">Jedi Archives</Checkbox>
            <Checkbox value="command">Command deck</Checkbox>
          </CheckboxGroup>
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
          <TextField name="test" aria-label="Mission name" />
          <FileField name="certificates" multiple>
            <Label>Holocrons</Label>
            <Button variant="outline" color="secondary">
              Choose
            </Button>
          </FileField>
          <Button type="submit" isPending={isPending.value}>
            Submit
          </Button>
          <Text>Called {callCount.value} times</Text>
          <CodeBlock
            code={JSON.stringify(
              { isPending: isPending.value, submitted: submitted.value },
              undefined,
              2,
            )}
          />
        </Section>
      </Form>
    );
  },
});
