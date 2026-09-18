import {
  Button,
  Checkbox,
  CheckboxGroup,
  CodeBlock,
  Form,
  Label,
  Option,
  Radio,
  RadioGroup,
  Section,
  Select,
  TextField,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h, ref } from "vue";

/**
 * The Vue counterpart of `/remote/simple-form`.
 *
 * `onSubmit` receives the `FormData` the host collected — the payload crosses
 * the boundary as data, so the extension never touches the host's DOM.
 */
export const SimpleFormDemo = defineComponent({
  name: "SimpleFormDemo",
  setup() {
    const submitted = ref<unknown>();

    return () =>
      h(
        Form,
        {
          onSubmit: (data: FormData) => {
            submitted.value = Array.from(data.entries());
          },
        },
        () =>
          h(Section, null, () => [
            h(CheckboxGroup, { name: "clearance" }, () => [
              h(Label, null, () => "Clearance"),
              h(Checkbox, { value: "archives" }, () => "Jedi Archives"),
              h(Checkbox, { value: "command" }, () => "Command deck"),
            ]),
            h(RadioGroup, { name: "role", defaultValue: "pilot" }, () => [
              h(Label, null, () => "Rank"),
              h(Radio, { value: "commander" }, () => "Commander"),
              h(Radio, { value: "pilot" }, () => "Pilot"),
            ]),
            h(TextField, { name: "callsign" }, () =>
              h(Label, null, () => "Callsign"),
            ),
            h(Select, { name: "homeworld", "aria-label": "Homeworld" }, () => [
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
            ]),
            h(Button, { type: "submit" }, () => "Submit"),
            h(CodeBlock, {
              code: JSON.stringify(submitted.value, undefined, 2),
            }),
          ]),
      );
  },
});
