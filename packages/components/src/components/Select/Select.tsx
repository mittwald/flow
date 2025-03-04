import { FieldError } from "@/components/FieldError";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { IconChevronDown } from "@/components/Icon/components/icons";
import { Options } from "@/components/Options";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { type OverlayController, useOverlayController } from "@/lib/controller";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import type { Key } from "react-aria-components";
import * as Aria from "react-aria-components";
import styles from "./Select.module.scss";

export interface SelectProps
  extends PropsWithChildren<
      Omit<Aria.SelectProps<{ example: string }>, "children" | "className">
    >,
    FlowComponentProps,
    PropsWithClassName {
  /** Handler that is called when the selected value changes. */
  onChange?: (value: string | number) => void;
  /** An overlay controller to control the select option popover state. */
  controller?: OverlayController;
}

/** @flr-generate all */
export const Select = flowComponent("Select", (props) => {
  const {
    children,
    className,
    onChange = () => {
      // default: do nothing
    },
    onSelectionChange = () => {
      // default: do nothing
    },
    controller: controllerFromProps,
    ref,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.select,
    formFieldStyles.formField,
    className,
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
    Option: {
      tunnelId: "options",
    },
  };

  const handleOnSelectionChange = (id: Key) => {
    onChange(String(id));
    onSelectionChange(id);
  };

  const controllerFromContext = useOverlayController("Select", {
    reuseControllerFromContext: true,
  });

  const controller = controllerFromProps ?? controllerFromContext;

  const isOpen = controller.useIsOpen();

  return (
    <Aria.Select
      {...rest}
      className={rootClassName}
      ref={ref}
      onSelectionChange={handleOnSelectionChange}
      onOpenChange={(isOpen) => controller.setOpen(isOpen)}
      isOpen={isOpen}
    >
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <Aria.Button className={styles.toggle}>
            <Aria.SelectValue />
            <IconChevronDown />
          </Aria.Button>

          {children}
          <Options controller={controller}>
            <TunnelExit id="options" />
          </Options>

          <FieldError className={formFieldStyles.fieldError} />
        </TunnelProvider>
      </PropsContextProvider>
    </Aria.Select>
  );
});

export default Select;
