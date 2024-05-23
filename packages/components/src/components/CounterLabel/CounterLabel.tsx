import type { FC, PropsWithChildren } from "react";
import React from "react";
import type { PropsWithElementType } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./CounterLabel.module.scss";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";

// accessibility über label am button mit anzahl des counters

export interface CounterLabelProps
  extends PropsWithChildren,
    PropsWithElementType<"span">,
    FlowComponentProps<"CounterLabel"> {}

export const CounterLabel: FC<CounterLabelProps> = flowComponent(
  "CounterLabel",
  (props) => {
    const { children, className, ...rest } = props;

    const rootClassName = clsx(styles.counterLabel, className);

    return (
      <span className={rootClassName} {...rest} aria-hidden>
        {children}
      </span>
    );
  },
);

export default CounterLabel;
