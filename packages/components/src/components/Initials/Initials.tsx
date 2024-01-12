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
  const { children, className } = useProps("initials", props);

  const initials = getInitialsFromString(children);

  const rootClassName = clsx(
    className,
    styles.root,
    styles[`variant-${getVariantFromInitials(initials)}`],
  );

  const initialsElements = initials.map((initial, index) => (
    <span key={index}>{initial}</span>
  ));

  return (
    <div aria-label={children} className={rootClassName}>
      {initialsElements}
    </div>
  );
};

export default Initials;
