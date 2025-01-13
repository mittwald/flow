import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./CheckboxGroup.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import { CheckboxButton } from "@/components/CheckboxButton";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import formFieldStyles from "../FormField/FormField.module.scss";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { deepHas } from "@/lib/react/deepHas";

export interface CheckboxGroupProps
  extends PropsWithChildren<Omit<Aria.CheckboxGroupProps, "children">>,
    Pick<ColumnLayoutProps, "s" | "m" | "l">,
    FlowComponentProps {}

/** @flr-generate all */
export const CheckboxGroup = flowComponent("CheckboxGroup", (props) => {
  const { children, className, s, m, l, ref, ...rest } = props;

  const rootClassName = clsx(formFieldStyles.formField, className);

  const propsContext: PropsContext = {
    Label: {
      className: formFieldStyles.label,
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
      tunnelId: "fieldDescription",
    },
    FieldError: {
      className: formFieldStyles.customFieldError,
      tunnelId: "fieldError",
    },
    Checkbox: {
      tunnelId: "checkboxes",
    },
    CheckboxButton: {
      tunnelId: "checkboxes",
    },
  };

  const hasCheckboxButtons = deepHas(children, CheckboxButton);

  return (
    <Aria.CheckboxGroup {...rest} className={rootClassName} ref={ref}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          {children}

          {hasCheckboxButtons && (
            <ColumnLayout s={s} m={m} l={l} className={styles.checkboxGroup}>
              <TunnelExit id="checkboxes" />
            </ColumnLayout>
          )}

          {!hasCheckboxButtons && (
            <div className={styles.checkboxGroup}>
              <TunnelExit id="checkboxes" />
            </div>
          )}

          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </TunnelProvider>
      </PropsContextProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.CheckboxGroup>
  );
});

export default CheckboxGroup;
