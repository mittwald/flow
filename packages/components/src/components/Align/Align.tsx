import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Align.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import PropsContextProvider from "@/lib/propsContext/PropsContextProvider";
import type { PropsWithClassName } from "@/lib/types/props";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface AlignProps
  extends PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps {}

export const Align = flowComponent("Align", (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.align, className);

  const propsContext: PropsContext = {
    Text: { className: styles.text },
    Button: { className: styles.button },
    Avatar: { className: styles.avatar, size: "m" },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <div className={rootClassName}>{children}</div>
    </PropsContextProvider>
  );
});

export default Align;
