import type { FC, PropsWithChildren } from "react";
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
import { deepFindOfType } from "@/lib/react/deepFindOfType";
import RadioButton from "./components/RadioButton";
import { SegmentedGroup } from "@/components/RadioGroup/components/SegmentedGroup";
import { Wrap } from "@/components/Wrap";

export interface RadioGroupProps
  extends PropsWithChildren<Omit<Aria.RadioGroupProps, "children">>,
    Pick<ColumnLayoutProps, "s" | "m" | "l"> {
  variant?: "segmented" | "default";
}

export const RadioGroup: FC<RadioGroupProps> = (props) => {
  const { children, className, variant = "default", s, m, l, ...rest } = props;

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

  if (variant === "segmented" && hasRadioButtons) {
    console.warn(
      "<RadioButton/> is not supported in 'segmented' variant of <RadioGroup />",
    );
  }

  return (
    <Aria.RadioGroup {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <TunnelExit id="label" />
          <Wrap if={variant === "segmented"}>
            <SegmentedGroup>
              <Wrap if={variant === "default" && hasRadioButtons}>
                <ColumnLayout s={s} m={m} l={l} className={styles.radioGroup}>
                  <Wrap if={variant === "default" && !hasRadioButtons}>
                    <div className={styles.radioGroup}>{children}</div>
                  </Wrap>
                </ColumnLayout>
              </Wrap>
            </SegmentedGroup>
          </Wrap>
          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </TunnelProvider>
      </PropsContextProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.RadioGroup>
  );
};

export default RadioGroup;
