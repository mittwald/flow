import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./RadioGroup.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import type { ColumnLayoutProps } from "@/components/ColumnLayout";
import { ColumnLayout } from "@/components/ColumnLayout";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import formFieldStyles from "../FormField/FormField.module.scss";
import { deepFindOfType } from "@/lib/react/deepFindOfType";
import RadioButton from "./components/RadioButton";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { IconCheck } from "@/components/Icon/components/icons";
import mergePropsContext from "@/lib/propsContext/mergePropsContext";

export interface RadioGroupProps
  extends PropsWithChildren<Omit<Aria.RadioGroupProps, "children">>,
    FlowComponentProps,
    Pick<ColumnLayoutProps, "s" | "m" | "l"> {
  variant?: "segmented" | "default";
}

export const RadioGroup = flowComponent("RadioGroup", (props) => {
  const {
    children,
    className,
    variant = "default",
    s,
    m,
    l,
    refProp: ref,
    ...rest
  } = props;

  const rootClassName = clsx(formFieldStyles.formField, className);

  let propsContext: PropsContext = {
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

  if (variant === "segmented") {
    propsContext = mergePropsContext(propsContext, {
      Radio: {
        className: styles.segment,
        unstyled: true,
        children: dynamic((props) => (
          <>
            {props.children}
            <IconCheck className={styles.checkmark} />
          </>
        )),
      },
    });
  }

  const hasRadioButtons = !!deepFindOfType(children, RadioButton);

  if (variant === "segmented" && hasRadioButtons) {
    console.warn(
      "<RadioButton/> is not supported in 'segmented' variant of <RadioGroup />",
    );
  }

  return (
    <Aria.RadioGroup {...rest} className={rootClassName} ref={ref}>
      <TunnelProvider>
        <PropsContextProvider props={propsContext} dependencies={[variant]}>
          {children}

          {variant === "segmented" && (
            <div className={styles.segmentedGroup}>
              <div className={styles.segments}>
                <TunnelExit id="radios" />
              </div>
            </div>
          )}

          {variant === "default" && hasRadioButtons && (
            <ColumnLayout s={s} m={m} l={l} className={styles.radioGroup}>
              <TunnelExit id="radios" />
            </ColumnLayout>
          )}

          {variant === "default" && !hasRadioButtons && (
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
