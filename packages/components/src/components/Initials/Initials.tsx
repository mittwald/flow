import React, { FC, PropsWithChildren } from "react";
import { getVariantFromInitials } from "./lib/getVariantFromInitials";
import { getInitialsFromString } from "./lib/getInitialsFromString";
import styles from "./Initials.module.css";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface InitialsProps extends PropsWithChildren<{ children: string }> {
  className?: string;
}

export const Initials: FC<InitialsProps> = (props) => {
  const { children, className } = useProps("Initials", props);

  const initials = getInitialsFromString(children);

  const rootClassName = clsx(
    className,
    styles.root,
    styles[`variant-${getVariantFromInitials(initials)}`],
  );

  const initialsElements = initials.map((initial, index) => (
    <span className={styles[`char-${index + 1}`]} key={index}>
      {initial}
    </span>
  ));

  return (
    <div aria-label={children} className={rootClassName}>
      {initialsElements}
    </div>
  );
};

export default Initials;
