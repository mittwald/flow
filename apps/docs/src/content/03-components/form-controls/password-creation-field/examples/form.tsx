import { useForm } from "react-hook-form";
import {
  Form,
  typedField,
} from "@mittwald/flow-react-components/react-hook-form";
import { sleep } from "@/content/03-components/actions/action/examples/lib";
import {
  Button,
  Label,
  Section,
  PasswordCreationField,
} from "@mittwald/flow-react-components";
import {
  generatePasswordCreationFieldValidation,
  Policy,
  RuleType,
} from "@mittwald/flow-react-components/mittwald-password-tools-js";

export default () => {
  const customPolicy = Policy.fromDeclaration({
    minComplexity: 3,
    rules: [
      {
        ruleType: RuleType.length,
        min: 8,
        max: 12,
      },
    ],
  });

  const form = useForm<{ password: string }>({
    defaultValues: {
      password: "",
    },
  });
  const Field = typedField(form);

  return (
    <Section>
      <Form form={form} onSubmit={sleep}>
        <Field
          name="password"
          rules={{
            required: true,
            validate:
              generatePasswordCreationFieldValidation(
                customPolicy,
              ),
          }}
        >
          <PasswordCreationField
            validationPolicy={customPolicy}
          >
            <Label>Passwort</Label>
          </PasswordCreationField>
        </Field>
        <Button type="submit">Speichern</Button>
      </Form>
    </Section>
  );
};
