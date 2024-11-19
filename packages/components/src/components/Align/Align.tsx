import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Align.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import PropsContextProvider from "@/lib/propsContext/PropsContextProvider";
import type { PropsWithClassName } from "@/lib/types/props";

export interface AlignProps extends PropsWithChildren, PropsWithClassName {}

export const Align: FC<AlignProps> = (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.align, className);

  const propsContext: PropsContext = {
    Text: { className: styles.text },
    Avatar: { className: styles.avatar, size: "m", color: "blue" },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <div className={rootClassName}>{children}</div>
    </PropsContextProvider>
  );
};

export default Align;
