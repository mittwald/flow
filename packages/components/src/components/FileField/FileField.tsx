import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { useFormValidation } from "@react-aria/form";
import { useFormValidationState } from "@react-stately/form";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import type * as Aria from "react-aria-components";
import { FieldErrorContext, InputContext } from "react-aria-components";
import type { FileInputOnChangeHandler } from "@/components/FileField/components/FileInput";
import { FileInput } from "@/components/FileField/components/FileInput";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { useObjectRef } from "@react-aria/utils";

export interface FileFieldProps
  extends PropsWithChildren,
    FlowComponentProps<HTMLInputElement>,
    Pick<Aria.InputProps, "accept" | "multiple" | "name">,
    Pick<
      Aria.TextFieldProps,
      "isRequired" | "isInvalid" | "validationBehavior" | "isDisabled"
    > {
  /** Handler that is called when the file input changes. */
  onChange?: FileInputOnChangeHandler;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const FileField = flowComponent("FileField", (props) => {
  const {
    children,
    ref,
    isRequired,
    isInvalid,
    isDisabled,
    validationBehavior,
    onChange,
    ...restInputProps
  } = props;
  const inputRef = useObjectRef(ref);

  const formValidationState = useFormValidationState({
    value: undefined,
    validationBehavior,
    isInvalid,
  });

  useFormValidation({ validationBehavior }, formValidationState, inputRef);

  const inputProps = useMemo(
    () => ({
      ...restInputProps,
      ref: inputRef,
      "aria-invalid": formValidationState.displayValidation.isInvalid,
      value: undefined,
    }),
    [formValidationState, isRequired, ...Object.values(restInputProps)],
  );

  const propsContext: PropsContext = {
    Label: {
      className: formFieldStyles.label,
      optional: !props.isRequired,
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
    },
    FieldError: {
      className: formFieldStyles.customFieldError,
    },
  };

  return (
    <InputContext.Provider value={inputProps}>
      <FieldErrorContext.Provider value={formValidationState.displayValidation}>
        <PropsContextProvider props={propsContext}>
          <div
            data-required={!!isRequired || undefined}
            data-invalid={
              formValidationState.displayValidation.isInvalid || undefined
            }
            className={formFieldStyles.formField}
          >
            <FileInput ref={ref} onChange={onChange} isDisabled={isDisabled}>
              {children}
            </FileInput>
          </div>
        </PropsContextProvider>
      </FieldErrorContext.Provider>
    </InputContext.Provider>
  );
});
export default FileField;
