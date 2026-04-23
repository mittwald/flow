import { type PropsWithChildren } from "react";
import type { Key } from "react-aria-components";
import * as Aria from "react-aria-components";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import styles from "./Select.module.scss";
import clsx from "clsx";
import { IconChevronDown } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Options } from "@/components/Options";
import type { PropsWithClassName } from "@/lib/types/props";
import { useOverlayController } from "@/lib/controller";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { UiComponentTunnelExit } from "../UiComponentTunnel/UiComponentTunnelExit";

export interface SelectProps
  extends
    PropsWithChildren<Omit<Aria.SelectProps, "children" | "className" | "ref">>,
    FlowComponentProps<HTMLButtonElement>,
    PropsWithClassName {
  /** Handler that is called when the selected value changes. */
  onChange?: (value: Key | null) => void;
  /** Whether the component is read only. */
  isReadOnly?: boolean;
}

/** @flr-generate all */
export const Select = flowComponent("Select", (props) => {
  const {
    children,
    className,
    onChange,
    onSelectionChange,
    isReadOnly,
    ref,
    ...rest
  } = props;

  const {
    FieldErrorView,
    fieldPropsContext,
    fieldProps,
    FieldErrorCaptureContext,
  } = useFieldComponent(props, "Select");

  const rootClassName = clsx(
    styles.select,
    formFieldStyles.formField,
    className,
  );

  const propsContext: PropsContext = {
    Option: {
      tunnel: {
        id: "options",
        component: "Select",
      },
    },
    ...fieldPropsContext,
  };

  const controller = useOverlayController("Select", {
    reuseControllerFromContext: false,
  });
  const isOpen = controller.useIsOpen();

  return (
    <Aria.Select
      {...rest}
      {...fieldProps}
      className={clsx(rootClassName, fieldProps.className)}
      onChange={(value) => {
        if (!isReadOnly) {
          onChange?.(value);
          onSelectionChange?.(value);
        }
      }}
      onOpenChange={(isOpen) => !isReadOnly && controller.setOpen(isOpen)}
      isOpen={isOpen}
      data-readonly={isReadOnly}
    >
      <FieldErrorCaptureContext>
        <PropsContextProvider props={propsContext}>
          <Aria.Button
            data-readonly={isReadOnly}
            className={styles.toggle}
            ref={ref}
          >
            <Aria.SelectValue />
            <IconChevronDown />
          </Aria.Button>
          {children}
          <Options controller={controller}>
            <UiComponentTunnelExit id="options" component="Select" />
          </Options>
        </PropsContextProvider>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </Aria.Select>
  );
});

export default Select;
