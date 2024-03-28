import React, { FC, PropsWithChildren } from "react";
import styles from "./CheckboxGroup.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import formFieldStyles from "../FormField/FormField.module.scss";

export interface CheckboxGroupProps
  extends PropsWithChildren<Omit<Aria.CheckboxGroupProps, "children">> {}

export const CheckboxGroup: FC<CheckboxGroupProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(
    styles.checkboxGroup,
    formFieldStyles.formField,
    className,
  );

  const propsContext: PropsContext = {
    Label: {
      className: formFieldStyles.label,
      tunnelId: "label",
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
      tunnelId: "fieldDescription",
    },
    FieldError: {
      className: formFieldStyles.customFieldError,
      tunnelId: "fieldError",
    },
  };

  return (
    <Aria.CheckboxGroup {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <TunnelExit id="label" />
          <div className={styles.checkboxes}>{children}</div>
          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </TunnelProvider>
      </PropsContextProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.CheckboxGroup>
  );
};

export default CheckboxGroup;
