import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { PropsWithContainerBreakpointSize } from "@/lib/types/props";
import { type PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import styles from "./SegmentedControl.module.scss";
import { getContainerBreakpointSizeClassName } from "@/lib/getContainerBreakpointSizeClassName";
import { type PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { UiComponentTunnelExit } from "../UiComponentTunnel/UiComponentTunnelExit";

export interface SegmentedControlProps
  extends
    PropsWithChildren<Omit<Aria.RadioGroupProps, "children" | "ref">>,
    FlowComponentProps<HTMLDivElement>,
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

  const {
    FieldErrorView,
    fieldPropsContext,
    fieldProps,
    FieldErrorCaptureContext,
  } = useFieldComponent(props, "SegmentedControl");

  const rootClassName = clsx(
    formFieldStyles.formField,
    styles.segmentedControlContainer,
    className,
    styles[getContainerBreakpointSizeClassName(containerBreakpointSize)],
  );

  const propsContext: PropsContext = {
    Segment: {
      tunnel: {
        id: "segments",
        component: "SegmentedControl",
      },
      className: styles.segment,
    },
    ...fieldPropsContext,
  };

  const objectRef = useObjectRef(ref);
  useMakeFocusable(objectRef);

  return (
    <Aria.RadioGroup
      {...rest}
      className={clsx(rootClassName, fieldProps.className)}
      ref={objectRef}
    >
      <FieldErrorCaptureContext>
        <PropsContextProvider dependencies={["segment"]} props={propsContext}>
          <div className={styles.segmentedControl}>
            <div className={styles.segments}>
              <UiComponentTunnelExit
                id="segments"
                component="SegmentedControl"
              />
            </div>
          </div>
          {children}
        </PropsContextProvider>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </Aria.RadioGroup>
  );
});

export default SegmentedControl;
