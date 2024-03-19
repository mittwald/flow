import React, { FC, PropsWithChildren } from "react";
import { getInitialsFromString } from "./lib/getInitialsFromString";
import styles from "./Initials.module.scss";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";
import { onlyText } from "react-children-utilities";

export interface InitialsProps extends PropsWithChildren<{ children: string }> {
  className?: string;
}

export const Initials: FC<InitialsProps> = (props) => {
  const { children, className } = useProps("Initials", props);

  const initials = getInitialsFromString(onlyText(children));

  const rootClassName = clsx(styles.initials, className);

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
