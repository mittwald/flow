import React, { FC, PropsWithChildren } from "react";
import styles from "./Segement.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { IconCheck } from "@/components/Icon/components/icons";

export interface SegmentProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">> {}

export const Segment: FC<SegmentProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.segment, className);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
    },
    Text: {
      className: styles.label,
    },
    Content: {
      className: styles.content,
    },
  };

  return (
    <Aria.Radio {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <IconCheck className={styles.checkmark} />
    </Aria.Radio>
  );
};

export default Segment;
