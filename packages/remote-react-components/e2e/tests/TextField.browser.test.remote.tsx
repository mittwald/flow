import { Text, TextField } from "../../src/auto-generated";
import { Form, Field } from "../../src/integrations/react-hook-form";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const standard = () => (
  <TextField placeholder="field" aria-label="field" />
);

export const onPaste = () => {
  const [pastedText, setPastedText] = useState("");
  return (
    <>
      {pastedText && (
        <Text data-testid="pasted-text" aria-label="pasted text">
          {pastedText}
        </Text>
      )}
      <TextField placeholder="copy-me" value="FOO" aria-label="copy me" />
      <TextField
        aria-label="field"
        placeholder="field"
        onPaste={(event) => {
          setPastedText(event.clipboardData.getData("text"));
        }}
      />
    </>
  );
};

const blockingFn = () => {
  for (let i = 0; i < 1000; i++) {
    JSON.parse('{"foo":"bar","baz":[1,2,3,4,5],"nested":{"a":1,"b":2}}');
  }
};

export const blockingValidation = () => (
  <Form
    form={useForm({
      mode: "onChange",
    })}
    onSubmit={() => {
      // nothing
    }}
  >
    <Field
      name="test"
      rules={{
        validate: {
          test: () => {
            blockingFn();
            return true;
          },
        },
      }}
    >
      <TextField placeholder="field" aria-label="test" />
    </Field>
  </Form>
);
