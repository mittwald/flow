import type { FC } from "react";
import React from "react";
import type { PropsWithElementType } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./CounterLabel.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface CounterLabelProps
  extends PropsWithElementType<"span">,
    FlowComponentProps<"CounterLabel"> {
  count?: number;
}

export const CounterLabel: FC<CounterLabelProps> = flowComponent(
  "CounterLabel",
  (props) => {
    const { className, count, ...rest } = props;

    const rootClassName = clsx(styles.counterLabel, className);

    return (
      <span className={rootClassName} {...rest} aria-hidden>
        {count && count > 99 ? "99+" : count}
      </span>
    );
  },
);

export default CounterLabel;
