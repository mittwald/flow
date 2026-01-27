import {
  DateRangePicker,
  Label,
  Section,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import type { CalendarDate } from "@internationalized/date";
import { sleep } from "@/content/04-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{
    range: { start: CalendarDate; end: CalendarDate };
  }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="range"
          rules={{
            required: "Bitte wähle einen Zeitraum aus",
          }}
        >
          <DateRangePicker>
            <Label>Zeitraum</Label>
          </DateRangePicker>
        </Field>
        <SubmitButton>Speichern</SubmitButton>
      </Form>
    </Section>
  );
};
