import React, { FC, PropsWithChildren } from "react";
import styles from "./CheckboxGroup.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import { CheckboxButton } from "@/components/CheckboxButton";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import formFieldStyles from "../FormField/FormField.module.scss";
import { ColumnLayout, ColumnLayoutProps } from "@/components/ColumnLayout";
import { deepFindOfType } from "@/lib/react/deepFindOfType";

export interface CheckboxGroupProps
  extends PropsWithChildren<Omit<Aria.CheckboxGroupProps, "children">>,
    Pick<ColumnLayoutProps, "s" | "m" | "l"> {}

export const CheckboxGroup: FC<CheckboxGroupProps> = (props) => {
  const { children, className, s, m, l, ...rest } = props;

  const rootClassName = clsx(formFieldStyles.formField, className);

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

  const hasCheckboxButtons = !!deepFindOfType(children, CheckboxButton);

  return (
    <Aria.CheckboxGroup {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <TunnelExit id="label" />

          {hasCheckboxButtons ? (
            <ColumnLayout s={s} m={m} l={l} className={styles.checkboxGroup}>
              {children}
            </ColumnLayout>
          ) : (
            <div className={styles.checkboxGroup}>{children}</div>
          )}

          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </TunnelProvider>
      </PropsContextProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.CheckboxGroup>
  );
};

export default CheckboxGroup;
