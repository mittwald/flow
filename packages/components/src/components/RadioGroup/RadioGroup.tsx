import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./RadioGroup.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import formFieldStyles from "../FormField/FormField.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

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
      tunnelId: "radioButtons",
    },
    Radio: {
      tunnelId: "radios",
    },
  };

  return (
    <Aria.RadioGroup {...rest} className={rootClassName} ref={ref}>
      <TunnelProvider>
        <PropsContextProvider
          dependencies={["radio"]}
          props={propsContext}
          mergeInParentContext
        >
          {children}

          <ColumnLayout s={s} m={m} l={l} className={styles.radioGroup}>
            <TunnelExit id="radioButtons" />
          </ColumnLayout>

          <ColumnLayout
            s={s ?? [1]}
            m={m ?? [1]}
            l={l ?? [1]}
            rowGap="s"
            className={styles.radioGroup}
          >
            <TunnelExit id="radios" />
          </ColumnLayout>

          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </PropsContextProvider>
      </TunnelProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.RadioGroup>
  );
});

export default RadioGroup;
