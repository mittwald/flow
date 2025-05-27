import React, { type FC, useLayoutEffect, useState } from "react";
import styles from "./ComplexityIndicator.module.scss";
import { getStatusFromPolicyValidationResult } from "@/components/PasswordCreationField/lib/getStatusFromPolicyValidationResult";
import clsx from "clsx";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import { type Status } from "@/lib/types/props";

export type ComplexityStatus = Exclude<Status, "info"> | "indeterminate";

export interface ComplexityIndicatorProps {
  isLoading: boolean;
  policyValidationResult?: ResolvedPolicyValidationResult;
}

/** @internal */
export const ComplexityIndicator: FC<ComplexityIndicatorProps> = (props) => {
  const { policyValidationResult, isLoading } = props;
  const complexityScore = policyValidationResult?.complexity;

  const [state, setState] = useState<{
    status: ComplexityStatus;
    percentage: number;
  }>({
    percentage: 0,
    status: "success",
  });

  useLayoutEffect(() => {
    let complexityFulfilledPercentage = 0;
    if (policyValidationResult?.isValid === "indeterminate") {
      complexityFulfilledPercentage = 100;
    } else if (
      complexityScore &&
      !policyValidationResult?.isEmptyValueValidation
    ) {
      complexityFulfilledPercentage = Math.min(
        (100 / (complexityScore.min + 1)) * (complexityScore.actual + 1),
        100,
      );
    }

    const policyValidationStatus = getStatusFromPolicyValidationResult(
      policyValidationResult,
    );

    setState({
      status: policyValidationStatus,
      percentage: complexityFulfilledPercentage,
    });
  }, [policyValidationResult]);

  const complexityVisible = state.percentage !== 0;
  const complexityFulfilled = state.percentage === 100;

  const percentageClassName = clsx(
    styles.bar,
    styles[`bar-background-status-${state.status}`],
    {
      [styles.loading as string]: isLoading,
      [styles.running as string]: !complexityFulfilled,
    },
  );

  return (
    <div
      aria-hidden={true}
      data-container="complexity"
      data-complexity-visible={complexityVisible}
      data-complexity-status={state.status}
      data-complexity-percentage={state.percentage}
      className={clsx(styles.complexityIndicator, {
        [styles.hide as string]: !complexityVisible,
      })}
    >
      <div
        style={{
          width: `${state.percentage}%`,
        }}
        className={percentageClassName}
      />
    </div>
  );
};

export default ComplexityIndicator;
