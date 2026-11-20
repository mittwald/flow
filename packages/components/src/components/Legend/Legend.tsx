import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import styles from "./Legend.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface LegendProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps<HTMLUListElement> {}

/** @flr-generate all */
export const Legend = flowComponent(
  "Legend",
  (props) => {
    const { children, className, ref, ...rest } = props;

    const rootClassName = clsx(styles.legend, className);

    return (
      <ul ref={ref} className={rootClassName} {...rest}>
        {children}
      </ul>
    );
  },
  /* Outer `Text` props contexts (e.g. the content color of `AccentBox`) keep
     reaching the item texts. */
  { type: "layout" },
);

export default Legend;
