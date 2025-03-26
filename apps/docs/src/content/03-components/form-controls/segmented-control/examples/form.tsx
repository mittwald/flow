import {
  Button,
  Label,
  Section,
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ payment: "debit" | "invoice" }>({
    defaultValues: { payment: "debit" },
  });
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="payment"
          rules={{
            required: "Bitte wähle eine Zahlungsart aus",
          }}
        >
          <SegmentedControl>
            <Label>Zahlungsart</Label>
            <Segment value="debit">Lastschrift</Segment>
            <Segment value="invoice">Rechnung</Segment>
          </SegmentedControl>
        </Field>
        <Button type="submit">Speichern</Button>
      </Form>
    </Section>
  );
};
