import {
  Label,
  CodeEditor,
  Section,
  ActionGroup,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Field,
  Form,
  SubmitButton,
} from "@mittwald/flow-react-components/react-hook-form";

export default () => {
  const form = useForm({
    defaultValues: {
      code:
        'import React, { FC } from "react";\n' +
        "\n" +
        "const ExampleCodeComponent: FC = () => {\n" +
        "  \n" +
        "  useEffect(() => {\n" +
        "    // some effect\n" +
        "  }, []);\n" +
        "  \n" +
        "  return <>Example JSX</>;\n" +
        "};",
    },
  });
  return (
    <Section>
      <Form
        form={form}
        onSubmit={(v) => console.log(v.code)}
      >
        <Field
          name="code"
          rules={{
            required: "Bitte gib Quelltext ein",
          }}
        >
          <CodeEditor language="tsx">
            <Label>Quelltext</Label>
          </CodeEditor>
        </Field>
        <ActionGroup>
          <SubmitButton color="accent">Senden</SubmitButton>
        </ActionGroup>
      </Form>
    </Section>
  );
};
