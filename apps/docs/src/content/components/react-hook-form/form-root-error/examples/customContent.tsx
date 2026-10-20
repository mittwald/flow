import { useForm } from "react-hook-form";
import {
  Field,
  Form,
  FormRootError,
  SubmitButton,
} from "@mittwald/flow-react-components/react-hook-form";
import {
  ActionGroup,
  Alert,
  Heading,
  Label,
  Section,
  Text,
  TextField,
} from "@mittwald/flow-react-components";

export default () => {
  interface Values {
    image: string;
  }
  const form = useForm<Values>({
    defaultValues: {
      image: "ghcr.io/mittwald/example:latest",
    },
  });

  return (
    <Section>
      <Form
        form={form}
        onSubmit={() => {
          form.setError("root", {
            type: "invalidRegistryCredentials",
          });
        }}
      >
        <Field name="image">
          <TextField>
            <Label>Image</Label>
          </TextField>
        </Field>
        <FormRootError>
          {(error) =>
            error.type === "invalidRegistryCredentials" && (
              <Alert status="danger">
                <Heading>Falsche Zugangsdaten</Heading>
                <Text>
                  Das Image kann nicht heruntergeladen
                  werden, da für die Registry falsche
                  Zugangsdaten hinterlegt sind.
                </Text>
              </Alert>
            )
          }
        </FormRootError>
        <ActionGroup>
          <SubmitButton>Container anlegen</SubmitButton>
        </ActionGroup>
      </Form>
    </Section>
  );
};
