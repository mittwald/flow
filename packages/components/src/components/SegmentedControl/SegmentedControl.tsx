import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { PropsWithContainerBreakpointSize } from "@/lib/types/props";
import React, { type PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import styles from "./SegmentedControl.module.scss";
import { getContainerBreakpointSizeClassName } from "@/lib/getContainerBreakpointSizeClassName";
import { type PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { FieldError } from "@/components/FieldError";
import clsx from "clsx";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";

export interface SegmentedControlProps
  extends PropsWithChildren<Omit<Aria.RadioGroupProps, "children">>,
    FlowComponentProps,
    PropsWithContainerBreakpointSize {}

/** @flr-generate all */
export const SegmentedControl = flowComponent("SegmentedControl", (props) => {
  const {
    children,
    className,
    containerBreakpointSize = "m",
    ref,
    ...rest
  } = props;

  const rootClassName = clsx(
    formFieldStyles.formField,
    styles.segmentedControlContainer,
    className,
    styles[getContainerBreakpointSizeClassName(containerBreakpointSize)],
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
    Segment: {
      tunnelId: "segments",
      className: styles.segment,
    },
  };

  const localRadioRef = useObjectRef(ref);
  useMakeFocusable(localRadioRef);

  return (
    <Aria.RadioGroup {...rest} className={rootClassName} ref={localRadioRef}>
      <PropsContextProvider dependencies={["segment"]} props={propsContext}>
        <TunnelProvider>
          {children}

          <div className={styles.segmentedControl}>
            <div className={styles.segments}>
              <TunnelExit id="segments" />
            </div>
          </div>

          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </TunnelProvider>
      </PropsContextProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.RadioGroup>
  );
});

export default SegmentedControl;
