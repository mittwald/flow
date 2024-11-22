import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { PropsWithContainerBreakpointSize } from "@/lib/types/props";
import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import styles from "./SegmentedControl.module.scss";
import { getContainerBreakpointSizeClassName } from "@/lib/getContainerBreakpointSizeClassName";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { FieldError } from "@/components/FieldError";
import clsx from "clsx";

export interface SegmentedControlProps
  extends PropsWithChildren<Omit<Aria.RadioGroupProps, "children">>,
    FlowComponentProps,
    PropsWithContainerBreakpointSize {}

export const SegmentedControl = flowComponent("SegmentedControl", (props) => {
  const {
    children,
    className,
    containerBreakpointSize = "m",
    refProp: ref,
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

  return (
    <Aria.RadioGroup {...rest} className={rootClassName} ref={ref}>
      <TunnelProvider>
        <PropsContextProvider
          dependencies={["segment"]}
          props={propsContext}
          mergeInParentContext
        >
          {children}

          <div className={styles.segmentedControl}>
            <div className={styles.segments}>
              <TunnelExit id="segments" />
            </div>
          </div>

          <TunnelExit id="fieldDescription" />
          <TunnelExit id="fieldError" />
        </PropsContextProvider>
      </TunnelProvider>
      <FieldError className={formFieldStyles.fieldError} />
    </Aria.RadioGroup>
  );
});
