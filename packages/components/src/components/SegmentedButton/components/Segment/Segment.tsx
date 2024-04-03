import React, { FC, PropsWithChildren } from "react";
import styles from "./Segement.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { IconCheck } from "@/components/Icon/components/icons";

export interface SegmentProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">> {}

export const Segment: FC<SegmentProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.segment, className);

  return (
    <Aria.Radio {...rest} className={rootClassName}>
      {children}
      <IconCheck className={styles.checkmark} />
    </Aria.Radio>
  );
};

export default Segment;
