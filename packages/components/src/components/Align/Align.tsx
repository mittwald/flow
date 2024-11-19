import type { FC, PropsWithChildren } from "react";
import React from "react";
import type { PropsWithClassName } from "@mittwald/flow-react-components/props";
import styles from "./Align.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@mittwald/flow-react-components/PropsContext";
import PropsContextProvider from "@mittwald/flow-react-components/PropsContextProvider";

export interface AlignProps extends PropsWithChildren, PropsWithClassName {}

export const Align: FC<AlignProps> = (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.align, className);

  const propsContext: PropsContext = {
    Text: { className: styles.text },
    Avatar: { className: styles.avatar, size: "m" },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <div className={rootClassName}>{children}</div>
    </PropsContextProvider>
  );
};

export default Align;
