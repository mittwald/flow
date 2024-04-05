import React, { FC, PropsWithChildren } from "react";
import styles from "./RadioGroup.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import { ColumnLayout, ColumnLayoutProps } from "@/components/ColumnLayout";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import formFieldStyles from "../FormField/FormField.module.scss";
import { deepFindOfType } from "@/lib/react/deepFindOfType";
import RadioButton from "./components/RadioButton";

export interface RadioGroupProps
  extends PropsWithChildren<Omit<Aria.RadioGroupProps, "children">>,
    Pick<ColumnLayoutProps, "s" | "m" | "l"> {}

export const RadioGroup: FC<RadioGroupProps> = (props) => {
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

  const hasRadioButtons = !!deepFindOfType(children, RadioButton);

  return (
    <Aria.RadioGroup {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <TunnelExit id="label" />

          {hasRadioButtons ? (
            <ColumnLayout s={s} m={m} l={l} className={styles.radioGroup}>
              {children}
            </ColumnLayout>
          ) : (
            <div className={styles.radioGroup}>{children}</div>
          )}

          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </TunnelProvider>
      </PropsContextProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.RadioGroup>
  );
};

export default RadioGroup;
