import {
  Button,
  DatePicker,
  Label,
  Section,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";
import type { CalendarDate } from "@internationalized/date";

export default () => {
  const form = useForm<{ date: CalendarDate }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="date"
          rules={{
            required: "Bitte wähle ein Datum aus",
          }}
        >
          <DatePicker>
            <Label>Datum</Label>
          </DatePicker>
        </Field>
        <Button type="submit">Speichern</Button>
      </Form>
    </Section>
  );
};
