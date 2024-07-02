import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./StepIndicator.module.scss";
import type { StepProps } from "./components/Step";
import { ChildPropsStore } from "@/lib/childProps/ChildPropsStore";
import { ChildPropsContextProvider } from "@/lib/childProps";
import { StepView } from "@/components/StepIndicator/components/Step/StepView";

export interface StepIndicatorProps extends PropsWithChildren {
  current?: string;
}

export const StepIndicator: FC<StepIndicatorProps> = (props) => {
  const { current, children } = props;

  const childrenProps = ChildPropsStore.useNew("steps");

  const stepProps = childrenProps.usePropsArray<StepProps>();

  const currentIndex = current
    ? stepProps.findIndex((p) => p.id === current)
    : 0;

  return (
    <div className={styles.stepIndicator}>
      <ChildPropsContextProvider store={childrenProps}>
        {children}
      </ChildPropsContextProvider>

      {stepProps.map((props, index) => {
        return (
          <StepView
            key={props.id}
            stepsLength={stepProps.length}
            stepNumber={index + 1}
            done={index < currentIndex}
            current={index === currentIndex}
          >
            {props.children}
          </StepView>
        );
      })}
    </div>
  );
};

export default StepIndicator;
