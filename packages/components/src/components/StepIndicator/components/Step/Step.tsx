import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Step.module.scss";
import clsx from "clsx";
import { Text } from "@/components/Text";

export interface StepProps extends PropsWithChildren {
  stepNumber: number;
  stepsLength: number;
  current?: boolean;
  done?: boolean;
}

export const Step: FC<StepProps> = (props) => {
  const { children, current, done, stepsLength, stepNumber } = props;

  const rootClassName = clsx(
    styles.step,
    current && styles.current,
    done && styles.done,
  );

  return (
    <div className={rootClassName}>
      {children}
      <Text className={styles.count}>{`(${stepNumber}/${stepsLength})`}</Text>
    </div>
  );
};

export default Step;
