import React, { FC, PropsWithChildren, ReactNode } from "react";
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

  return (
    <div className={rootClassName}>
      {children}
      <Text>{value}</Text>
      {copyable && <CopyButton value={value} />}
    </div>
  );
};

export default LabeledValue;
