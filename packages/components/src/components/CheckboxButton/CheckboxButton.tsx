import styles from "./CheckboxButton.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { CheckboxProps } from "@/components/Checkbox";
import { Checkbox } from "@/components/Checkbox";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";

export interface CheckboxButtonProps
  extends CheckboxProps,
    FlowComponentProps {}

/** @flr-generate all */
export const CheckboxButton = flowComponent("CheckboxButton", (props) => {
  const { children, className, ref, inputClassName, ...rest } = props;

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

  const localCheckboxButtonRef = useObjectRef(ref);
  useMakeFocusable(localCheckboxButtonRef);

  return (
    <div
      {...fieldProps}
      className={clsx(fieldProps.className, styles.checkboxButton, className)}
      ref={localCheckboxButtonRef}
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
