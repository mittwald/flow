import {
  ActionGroup,
  CheckboxButton,
  ColumnLayout,
  DatePicker,
  Heading,
  Section,
  TextField,
  Label,
} from "@mittwald/flow-react-components";
import {
  Form,
  SubmitButton,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import {
  type CalendarDate,
  getLocalTimeZone,
  today,
} from "@internationalized/date";

export default () => {
  const form = useForm<{
    description: string;
    withExpirationDate: boolean;
    expirationDate: CalendarDate;
  }>({
    defaultValues: {
      description: "",
      withExpirationDate: false,
    },
  });

  const Field = typedField(form);

  const watchedWithExpirationDate = useWatch({
    control: form.control,
    name: "withExpirationDate",
  });

  const tomorrow = today(getLocalTimeZone()).add({
    days: 1,
  });

  return (
    <Form
      form={form}
      onSubmit={() => console.log("submitted")}
    >
      <Section>
        <Heading>API-Token anlegen</Heading>
        <Field
          name="description"
          rules={{
            required: "Bitte gib eine Beschreibung ein",
          }}
        >
          <TextField>
            <Label>Beschreibung</Label>
          </TextField>
        </Field>
        <ColumnLayout m={[1, 1]}>
          <Field name="withExpirationDate">
            <CheckboxButton>Mit Ablaufdatum</CheckboxButton>
          </Field>

          {watchedWithExpirationDate && (
            <Field
              name="expirationDate"
              rules={{
                required: "Bitte gib ein Ablaufdatum ein",
                validate: {
                  future: (d) =>
                    d && d >= tomorrow
                      ? true
                      : "Das Ablaufdatum muss in der Zukunft liegen",
                },
              }}
            >
              <DatePicker
                aria-label="Ablaufdatum"
                minValue={tomorrow}
              />
            </Field>
          )}
        </ColumnLayout>
        <ActionGroup>
          <SubmitButton color="accent">
            Anlegen
          </SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
