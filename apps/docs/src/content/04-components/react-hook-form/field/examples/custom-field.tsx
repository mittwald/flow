import {
  type FieldPropsComponent,
  Form,
  SubmitButton,
  typedField,
  useFieldProps,
} from "@mittwald/flow-react-components/react-hook-form";
import {
  ActionGroup,
  Label,
  Section,
} from "@mittwald/flow-react-components";
import { type FC, useMemo } from "react";
import { useForm } from "react-hook-form";

export default () => {
  const CustomFieldComponent: FC<FieldPropsComponent> = (
    props,
  ) => {
    const {
      ref,
      children,
      value,
      defaultValue,
      onChange,
      onBlur,
      form,
      name,
      disabled,
      isReadOnly,
      fieldComponents: {
        FieldErrorView,
        FieldComponentContainer,
        FieldChildrenContainer,
      },
    } = useFieldProps(props);

    return (
      <FieldComponentContainer>
        <FieldChildrenContainer>
          {children}
        </FieldChildrenContainer>
        <input
          readOnly={isReadOnly}
          disabled={disabled}
          form={form}
          name={name}
          ref={ref}
          style={{ order: 2 }}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
        />
        <FieldErrorView />
      </FieldComponentContainer>
    );
  };

  // only necessary because CustomFieldComponent is an inline component in this demo page
  const MemoCustomFieldComponent = useMemo(
    () => CustomFieldComponent,
    [],
  );

  interface Values {
    myCustomField: string;
  }
  const form = useForm<Values>();
  const Field = typedField(form);

  return (
    <Form form={form} onSubmit={console.log}>
      <Section>
        <Field
          name="myCustomField"
          rules={{
            required: "Bitte gib eine Nachricht ein",
          }}
        >
          <MemoCustomFieldComponent>
            <Label>Name</Label>
          </MemoCustomFieldComponent>
        </Field>
        <ActionGroup>
          <SubmitButton>Speichern</SubmitButton>
        </ActionGroup>
      </Section>
    </Form>
  );
};
