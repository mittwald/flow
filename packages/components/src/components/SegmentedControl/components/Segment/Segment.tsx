import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Segment.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { IconCheck } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { ClearPropsContext } from "@/lib/propsContext";

export interface SegmentProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">>,
    FlowComponentProps {}

export const Segment = flowComponent("Segment", (props) => {
  const { children, className, refProp: ref, ...rest } = props;

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
