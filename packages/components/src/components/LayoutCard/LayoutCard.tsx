import React, { FC, PropsWithChildren } from "react";
import { useProps } from "@/lib/propsContext";
import styles from "./LayoutCard.module.scss";
import clsx from "clsx";
import { PropsWithElementType } from "@/lib/types/props";

export interface LayoutCardProps
  extends PropsWithChildren,
    PropsWithElementType {}

export const LayoutCard: FC<LayoutCardProps> = (props) => {
  const {
    children,
    className,
    elementType = "div",
    ...rest
  } = useProps("LayoutCard", props);

  const rootClassName = clsx(styles.layoutCard, className);

  const Element = elementType;

  return (
    <Element className={rootClassName} {...rest}>
      {children}
    </Element>
  );
};

export default LayoutCard;
