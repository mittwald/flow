import React, { FC, PropsWithChildren, ReactNode } from "react";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import styles from "./LabeledValue.module.css";
import clsx from "clsx";
import { Text } from "@/components/Text";
import { CopyButton } from "@/components/CopyButton";

export interface LabeledValueProps extends PropsWithChildren {
  className?: string;
  value: ReactNode;
  copyable?: boolean;
}

export const LabeledValue: FC<LabeledValueProps> = (props) => {
  const { children, value, className, copyable } = props;

  const rootClassName = clsx(className, styles.root);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
    },
  };

  return (
    <div className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
        <Text>
          {value}
          {copyable && <CopyButton value={value} />}
        </Text>
      </PropsContextProvider>
    </div>
  );
};

export default LabeledValue;
