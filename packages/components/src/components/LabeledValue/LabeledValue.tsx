import React, { FC, PropsWithChildren } from "react";
import styles from "./LabeledValue.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

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
    Content: {
      className: styles.content,
    },
    CopyToClipboard: {
      className: styles.copyButton,
      style: "plain",
      size: "small",
    },
  };

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </div>
  );
};

export default LabeledValue;
