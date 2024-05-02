import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./LabeledValue.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface LabeledValueProps extends PropsWithChildren {
  className?: string;
}

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
