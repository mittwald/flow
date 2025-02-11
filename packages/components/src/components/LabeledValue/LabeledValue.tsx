import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./LabeledValue.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";

export interface LabeledValueProps
  extends PropsWithChildren,
    PropsWithClassName {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const LabeledValue: FC<LabeledValueProps> = (props) => {
  const { children, className } = props;

  const rootClassName = clsx(styles.labeledValue, className);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
    },
    CopyButton: {
      className: styles.button,
      variant: "plain",
      size: "s",
    },
    Button: {
      className: styles.button,
      variant: "plain",
      size: "s",
    },
    Link: {
      inline: true,
    },
  };

  return (
    <ClearPropsContext>
      <div className={rootClassName}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </div>
    </ClearPropsContext>
  );
};

export default LabeledValue;
