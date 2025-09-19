import type { PropsWithChildren } from "react";
import styles from "./Segment.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { IconCheck } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface SegmentProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">>,
    FlowComponentProps<HTMLLabelElement> {}

/** @flr-generate all */
export const Segment = flowComponent("Segment", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.segment, className);

  return (
    <Aria.Radio {...rest} className={rootClassName} ref={ref}>
      {children}
      <IconCheck className={styles.checkmark} />
    </Aria.Radio>
  );
});

export default Segment;
