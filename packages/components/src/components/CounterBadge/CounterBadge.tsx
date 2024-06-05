import type { FC } from "react";
import React from "react";
import type { PropsWithElementType } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./CounterBadge.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface CounterBadgeProps
  extends PropsWithElementType<"span">,
    FlowComponentProps {
  count?: number;
}

export const CounterBadge: FC<CounterBadgeProps> = flowComponent(
  "CounterBadge",
  (props) => {
    const { className, count, ...rest } = props;

    const rootClassName = clsx(styles.counterBadge, className);

    return (
      <span className={rootClassName} {...rest} aria-hidden>
        {count && count > 99 ? "99+" : count}
      </span>
    );
  },
);

export default CounterBadge;
