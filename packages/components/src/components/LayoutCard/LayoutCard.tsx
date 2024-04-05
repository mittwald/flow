import React, { PropsWithChildren } from "react";
import styles from "./LayoutCard.module.scss";
import clsx from "clsx";
import { PropsWithElementType } from "@/lib/types/props";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface LayoutCardProps
  extends PropsWithChildren,
    PropsWithElementType,
    FlowComponentProps {}

export const LayoutCard = flowComponent("LayoutCard", (props) => {
  const { children, className, elementType = "div", ...rest } = props;

  const rootClassName = clsx(styles.layoutCard, className);

  const Element = elementType;

  return (
    <Element className={rootClassName} {...rest}>
      {children}
    </Element>
  );
});

export default LayoutCard;
