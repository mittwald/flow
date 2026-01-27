import {
  Label,
  Radio,
  RadioGroup,
  Section,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/04-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ coffee: string }>({
    defaultValues: { coffee: "more" },
  });
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="coffee"
          rules={{
            required: "Bitte gib deinen Kaffeekonsum an",
          }}
        >
          <RadioGroup>
            <Label>Täglicher Kaffeekonsum</Label>
            <Radio value="more">Mehr als 6 Tassen</Radio>
            <Radio value="5-6">5-6 Tassen</Radio>
            <Radio value="3-4">3-4 Tassen</Radio>
            <Radio value="1-2">1-2 Tassen</Radio>
            <Radio value="none">Trinke keinen Kaffee</Radio>
          </RadioGroup>
        </Field>
        <SubmitButton>Speichern</SubmitButton>
      </Form>
    </Section>
  );
};
