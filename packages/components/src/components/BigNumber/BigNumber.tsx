import type { PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./BigNumber.module.scss";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface BigNumberProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps<HTMLSpanElement> {}

const propsContext: PropsContext = {
  Text: {
    className: styles.text,
  },
};

/** @flr-generate all */
export const BigNumber = flowComponent(
  "BigNumber",
  (props) => {
    const { children, className, ref } = props;

    const rootClassName = clsx(styles.bigNumber, className);

    return (
      <PropsContextProvider props={propsContext}>
        <span ref={ref} className={rootClassName}>
          {children}
        </span>
      </PropsContextProvider>
    );
  },
  /* Outer `Text` props contexts (e.g. the content color of `AccentBox`) keep
     reaching the texts. */
  { type: "layout" },
);

export default BigNumber;
