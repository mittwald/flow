import { IconCheck } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Segment.module.scss";

export interface SegmentProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const Segment = flowComponent<"Segment", HTMLLabelElement>(
  "Segment",
  (props) => {
    const { children, className, ref, ...rest } = props;

    const rootClassName = clsx(styles.segment, className);

    return (
      <ClearPropsContextView>
        <Aria.Radio {...rest} className={rootClassName} ref={ref}>
          {children}
          <IconCheck className={styles.checkmark} />
        </Aria.Radio>
      </ClearPropsContextView>
    );
  },
);

export default Segment;
