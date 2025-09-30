import {
  Button,
  Label,
  Section,
  Slider,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";

export default () => {
  const form = useForm<{ storage: number }>();
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="storage"
          rules={{
            required:
              "Bitte wähle deinen Speicherplatz aus",
          }}
        >
          <Slider
            formatOptions={{
              style: "unit",
              unit: "gigabyte",
            }}
            minValue={50}
            maxValue={750}
            defaultValue={150}
            step={50}
            showInitialMarker
          >
            <Label>Speicherplatz</Label>
          </Slider>
        </Field>
        <Button type="submit">Speichern</Button>
      </Form>
    </Section>
  );
};
