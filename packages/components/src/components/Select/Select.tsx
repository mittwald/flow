import { type PropsWithChildren, useRef } from "react";
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
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { PropsWithClassName } from "@/lib/types/props";
import { type OverlayController, useOverlayController } from "@/lib/controller";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface SelectProps
  extends PropsWithChildren<Omit<Aria.SelectProps, "children" | "className">>,
    FlowComponentProps,
    PropsWithClassName {
  /** Handler that is called when the selected value changes. */
  onChange?: (value: Key | null) => void;
  /** An overlay controller to control the select option popover state. */
  controller?: OverlayController;
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
    controller: controllerFromProps,
    ref,
    isReadOnly,
    ...rest
  } = props;

  const {
    FieldErrorView,
    fieldPropsContext,
    fieldProps,
    FieldErrorCaptureContext,
  } = useFieldComponent(props);

  const rootClassName = clsx(
    styles.select,
    formFieldStyles.formField,
    className,
  );

  const propsContext: PropsContext = {
    Option: {
      tunnelId: "options",
    },
    ...fieldPropsContext,
  };

  const controllerFromContext = useOverlayController("Select", {
    reuseControllerFromContext: true,
  });

  const localSelectRef = useObjectRef(ref);
  const localButtonRef = useRef<HTMLButtonElement>(null);

  useMakeFocusable(localSelectRef, () => {
    localButtonRef.current?.focus();
    controller.setOpen(true);
  });

  const controller = controllerFromProps ?? controllerFromContext;
  const isOpen = controller.useIsOpen();

  return (
    <Aria.Select
      {...rest}
      {...fieldProps}
      className={clsx(rootClassName, fieldProps.className)}
      ref={localSelectRef}
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
      <TunnelProvider>
        <FieldErrorCaptureContext>
          <PropsContextProvider props={propsContext}>
            <Aria.Button
              ref={localButtonRef}
              data-readonly={isReadOnly}
              className={styles.toggle}
            >
              <Aria.SelectValue />
              <IconChevronDown />
            </Aria.Button>
            {children}
            <Options controller={controller}>
              <TunnelExit id="options" />
            </Options>
          </PropsContextProvider>
        </FieldErrorCaptureContext>
        <FieldErrorView />
      </TunnelProvider>
    </Aria.Select>
  );
});

export default Select;
