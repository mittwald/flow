import {
  Button,
  DateRangePicker,
  Label,
  Section,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import type { CalendarDate } from "@internationalized/date";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

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
        <Button type="submit">Speichern</Button>
      </Form>
    </Section>
  );
};
