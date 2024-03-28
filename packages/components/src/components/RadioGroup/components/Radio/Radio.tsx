import React, { FC, PropsWithChildren } from "react";
import styles from "./Radio.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { IconRadioOff, IconRadioOn } from "@/components/Icon/components/icons";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">> {}

export const Radio: FC<RadioProps> = (props) => {
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
};

export default Radio;
