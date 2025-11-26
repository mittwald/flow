import styles from "./CheckboxButton.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { CheckboxProps } from "@/components/Checkbox";
import { Checkbox } from "@/components/Checkbox";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface CheckboxButtonProps
  extends CheckboxProps,
    FlowComponentProps<HTMLInputElement> {}

/** @flr-generate all */
export const CheckboxButton = flowComponent("CheckboxButton", (props) => {
  const { children, className, inputClassName, ...rest } = props;

  const {
    fieldPropsContext,
    fieldProps,
    FieldErrorView,
    FieldErrorCaptureContext,
  } = useFieldComponent(props);

  const mergedPropsContext: PropsContext = {
    Text: {
      className: styles.label,
    },
    Content: {
      className: styles.content,
    },
    ...fieldPropsContext,
  };

  return (
    <div
      {...fieldProps}
      className={clsx(fieldProps.className, styles.checkboxButton, className)}
    >
      <FieldErrorCaptureContext>
        <Checkbox {...rest} inputClassName={clsx(inputClassName, styles.input)}>
          <PropsContextProvider props={mergedPropsContext}>
            {children}
          </PropsContextProvider>
        </Checkbox>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </div>
  );
});

export default CheckboxButton;
