import React, { FC, PropsWithChildren } from "react";
import styles from "./StepIndicator.module.scss";
import { Step } from "./components/Step";

export interface StepIndicatorProps {
  steps: string[];
  current: number;
}

export const StepIndicator: FC<StepIndicatorProps> = (props) => {
  const { steps, current } = props;

  const stepElements = steps.map((step, index) => {
    const stepNumber = index + 1;
    return (
      <Step
        stepNumber={stepNumber}
        stepsLength={steps.length}
        current={stepNumber === current}
        done={stepNumber < current}
      >
        {step}
      </Step>
    );
  });

  return <div className={styles.stepIndicator}>{stepElements}</div>;
};

export default StepIndicator;
