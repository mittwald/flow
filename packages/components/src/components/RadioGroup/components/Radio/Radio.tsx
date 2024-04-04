import React, { PropsWithChildren } from "react";
import styles from "./Radio.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { IconRadioOff, IconRadioOn } from "@/components/Icon/components/icons";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">>,
    FlowComponentProps {}

export const Radio = flowComponent("Radio", (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.radio, className);

  return (
    <Aria.Radio {...rest} className={rootClassName}>
      {({ isSelected }) => (
        <>
          {isSelected ? (
            <IconRadioOn className={styles.icon} />
          ) : (
            <IconRadioOff className={styles.icon} />
          )}
          {children}
        </>
      )}
    </Aria.Radio>
  );
});

export default Radio;
