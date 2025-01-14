import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./RadioGroup.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import type { PropsContext } from "~/lib/propsContext";
import { PropsContextProvider } from "~/lib/propsContext";
import { FieldError } from "~/components/FieldError";
import type { ColumnLayoutProps } from "~/components/ColumnLayout";
import { ColumnLayout } from "~/components/ColumnLayout";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import formFieldStyles from "../FormField/FormField.module.scss";
import RadioButton from "./components/RadioButton";
import type { FlowComponentProps } from "~/lib/componentFactory/flowComponent";
import { flowComponent } from "~/lib/componentFactory/flowComponent";
import { deepHas } from "~/lib/react/deepHas";

export interface RadioGroupProps
  extends PropsWithChildren<Omit<Aria.RadioGroupProps, "children">>,
    FlowComponentProps,
    Pick<ColumnLayoutProps, "s" | "m" | "l"> {}

/** @flr-generate all */
export const RadioGroup = flowComponent("RadioGroup", (props) => {
  const { children, className, s, m, l, ref, ...rest } = props;

  const rootClassName = clsx(
    formFieldStyles.formField,
    styles.radioGroupContainer,
    className,
  );

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
    RadioButton: {
      tunnelId: "radios",
    },
    Radio: {
      tunnelId: "radios",
    },
  };

  const hasRadioButtons = deepHas(children, RadioButton);

  return (
    <Aria.RadioGroup {...rest} className={rootClassName} ref={ref}>
      <TunnelProvider>
        <PropsContextProvider
          dependencies={["radio"]}
          props={propsContext}
          mergeInParentContext
        >
          {children}

          {hasRadioButtons && (
            <ColumnLayout s={s} m={m} l={l} className={styles.radioGroup}>
              <TunnelExit id="radios" />
            </ColumnLayout>
          )}

          {!hasRadioButtons && (
            <div className={styles.radioGroup}>
              <TunnelExit id="radios" />
            </div>
          )}

          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </PropsContextProvider>
      </TunnelProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.RadioGroup>
  );
});

export default RadioGroup;
