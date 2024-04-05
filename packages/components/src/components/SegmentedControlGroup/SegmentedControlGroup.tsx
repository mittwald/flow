import React, { FC, PropsWithChildren } from "react";
import styles from "./SegmentedControllGroup.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import {
  dynamic,
  PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import formFieldStyles from "../FormField/FormField.module.scss";
import { IconCheck } from "../Icon/components/icons";

export interface SegmentedControlGroupProps
  extends PropsWithChildren<Omit<Aria.RadioGroupProps, "children">> {}

export const SegmentedControlGroup: FC<SegmentedControlGroupProps> = (
  props,
) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(
    styles.segmentedControlGroup,
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
  };

  return (
    <Aria.RadioGroup {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <TunnelExit id="label" />
          <div className={styles.segments}>{children}</div>
          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </TunnelProvider>
      </PropsContextProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.RadioGroup>
  );
};

export default SegmentedControlGroup;
