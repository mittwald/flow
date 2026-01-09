import {
  Label,
  Section,
  TimeField,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";
import type { CalendarDateTime } from "@internationalized/date";

export default () => {
  const form = useForm<{ time: CalendarDateTime }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="time"
          rules={{
            required: "Bitte gib eine Uhrzeit ein",
          }}
        >
          <TimeField>
            <Label>Uhrzeit</Label>
          </TimeField>
        </Field>
        <SubmitButton>Speichern</SubmitButton>
      </Form>
    </Section>
  );
};
