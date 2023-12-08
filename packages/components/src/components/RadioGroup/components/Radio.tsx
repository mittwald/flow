import React, { FC, PropsWithChildren, ReactNode } from "react";
import styles from "./Radio.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { Icon } from "@/components";
import { IconLookup } from "@fortawesome/fontawesome-svg-core";

export interface RadioProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">> {
  description?: ReactNode;
  icon?: IconLookup | ReactNode;
}

export const Radio: FC<RadioProps> = (props) => {
  const { children, description, icon, className, ...rest } = props;

  const rootClassName = clsx(className, styles.radio);

  return (
    <Aria.Radio {...rest} className={rootClassName}>
      <span className={styles.title}>{children}</span>
      {description && <span className={styles.description}>{description}</span>}
      {icon && <Icon faIcon={icon} />}
    </Aria.Radio>
  );
};

export default Radio;
