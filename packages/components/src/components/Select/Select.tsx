import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { FieldError } from "@/components/FieldError";
import styles from "./Select.module.scss";
import clsx from "clsx";
import { IconChevronDown } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Options } from "@/components/Select/components/Options";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import type { Key } from "react-aria-components";
import type { PropsWithClassName } from "@/lib/types/props";

export interface SelectProps
  extends PropsWithChildren<
      Omit<Aria.SelectProps<{ example: string }>, "children" | "className">
    >,
    FlowComponentProps,
    PropsWithClassName {
  onChange?: (value: string) => void;
}

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
    refProp: ref,
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

  return (
    <Aria.Select
      {...rest}
      className={rootClassName}
      ref={ref}
      onSelectionChange={handleOnSelectionChange}
    >
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <Aria.Button className={styles.toggle}>
            <Aria.SelectValue />
            <IconChevronDown />
          </Aria.Button>

          {children}

          <Options>
            <TunnelExit id="options" />
          </Options>

          <FieldError className={formFieldStyles.fieldError} />
        </TunnelProvider>
      </PropsContextProvider>
    </Aria.Select>
  );
});

export default Select;
