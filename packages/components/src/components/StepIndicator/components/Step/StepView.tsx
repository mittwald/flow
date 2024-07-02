import type { FC, PropsWithChildren } from "react";
import React from "react";
import Link from "@/components/Link";
import styles from "@/components/StepIndicator/components/Step/Step.module.scss";
import { Text } from "@/components/Text";
import clsx from "clsx";

export interface StepViewProps extends PropsWithChildren {
  current?: boolean;
  done?: boolean;
  stepsLength: number;
  stepNumber: number;
}

export const StepView: FC<StepViewProps> = (props) => {
  const { children, current, done, stepNumber, stepsLength } = props;

  const rootClassName = clsx(
    styles.step,
    current && styles.current,
    done && styles.done,
  );

  return (
    <div className={rootClassName}>
      <Link className={styles.link} unstyled isDisabled={current || !done}>
        {children}
        <Text className={styles.count}>{`(${stepNumber}/${stepsLength})`}</Text>
      </Link>
    </div>
  );
};

export default StepView;
