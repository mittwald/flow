import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Segment.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { IconCheck } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";

export interface SegmentProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">>,
    FlowComponentProps<HTMLLabelElement> {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Segment = flowComponent("Segment", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.segment, className);

  return (
    <ClearPropsContext>
      <Aria.Radio {...rest} className={rootClassName} ref={ref}>
        {children}
        <IconCheck className={styles.checkmark} />
      </Aria.Radio>
    </ClearPropsContext>
  );
});

export default Segment;
