import type { FC } from "react";
import React from "react";
import styles from "./TabTitle.module.scss";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import { TunnelExit } from "@mittwald/react-tunnel";

interface Props extends PropsWithClassName {
  id?: string;
}

export const TabTitleCollapsed: FC<Props> = (props) => {
  const { className, ...rest } = props;

  const rootClassName = clsx(className, styles.tabTitle);

  return (
    <div {...rest} className={rootClassName} data-selected>
      <TunnelExit id="ActiveTitle" />
    </div>
  );
};

export default TabTitleCollapsed;
