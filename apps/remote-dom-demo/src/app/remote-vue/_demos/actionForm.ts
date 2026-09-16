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
import { defineComponent, h, ref } from "vue";

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

    return () =>
      h(Form, { onSubmit: (data: FormData) => void submit(data) }, () =>
        h(Section, null, () => [
          h(CheckboxGroup, { name: "check" }, () => [
            h(Label, null, () => "Clearance"),
            h(Checkbox, { value: "archives" }, () => "Jedi Archives"),
            h(Checkbox, { value: "command" }, () => "Command deck"),
          ]),
          h(Select, { name: "select", "aria-label": "Homeworld" }, () => [
            h(
              Option,
              { value: "Tatooine", textValue: "Tatooine" },
              () => "Tatooine",
            ),
            h(
              Option,
              { value: "Alderaan", textValue: "Alderaan" },
              () => "Alderaan",
            ),
            h(Option, { value: "Hoth", textValue: "Hoth" }, () => "Hoth"),
          ]),
          h(TextField, { name: "test", "aria-label": "Mission name" }),
          h(FileField, { name: "certificates", multiple: true }, () => [
            h(Label, null, () => "Holocrons"),
            h(
              Button,
              { variant: "outline", color: "secondary" },
              () => "Choose",
            ),
          ]),
          h(
            Button,
            { type: "submit", isPending: isPending.value },
            () => "Submit",
          ),
          h(Text, null, () => `Called ${callCount.value} times`),
          h(CodeBlock, {
            code: JSON.stringify(
              { isPending: isPending.value, submitted: submitted.value },
              undefined,
              2,
            ),
          }),
        ]),
      );
  },
});
