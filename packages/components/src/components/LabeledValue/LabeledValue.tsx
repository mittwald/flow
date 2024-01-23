import React, { FC, PropsWithChildren } from "react";
import styles from "./LabeledValue.module.scss";
import clsx from "clsx";
import { CopyButton } from "@/components/CopyButton";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface LabeledValueProps extends PropsWithChildren {
  className?: string;
  copyValue?: string;
}

export const LabeledValue: FC<LabeledValueProps> = (props) => {
  const { children, className, copyValue } = props;

  const rootClassName = clsx(styles.labeledValue, className);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
    },
    Content: {
      className: styles.content,
    },
  };

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      {copyValue && <CopyButton className={styles.copy} value={copyValue} />}
    </div>
  );
};

export default LabeledValue;
