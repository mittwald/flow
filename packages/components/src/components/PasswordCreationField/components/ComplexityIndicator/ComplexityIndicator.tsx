import React, { type FC, useLayoutEffect, useState } from "react";
import styles from "./ComplexityIndicator.module.scss";
import { getStatusFromPolicyValidationResult } from "@/components/PasswordCreationField/lib/getStatusFromPolicyValidationResult";
import clsx from "clsx";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import { type Status } from "@/lib/types/props";
import type { StateFromLatestPolicyValidationResult } from "@/components/PasswordCreationField/lib/getStateFromLatestPolicyValidationResult";

export type ComplexityStatus = Exclude<Status, "info"> | "indeterminate";

export interface ComplexityIndicatorProps {
  isLoading: boolean;
  isEmptyValue: boolean;
  validationResultState: StateFromLatestPolicyValidationResult;
  policyValidationResult: ResolvedPolicyValidationResult;
}

/** @internal */
export const ComplexityIndicator: FC<ComplexityIndicatorProps> = (props) => {
  const {
    policyValidationResult,
    validationResultState,
    isLoading,
    isEmptyValue,
  } = props;
  const complexityScore = policyValidationResult?.complexity;

  const [state, setState] = useState<{
    status: ComplexityStatus;
    percentage: number;
  }>({
    percentage: -1,
    status: "success",
  });

  useLayoutEffect(() => {
    if (isEmptyValue) {
      setState({
        status: "success",
        percentage: -1,
      });
      return;
    }

    let complexityFulfilledPercentage = -1;
    if (policyValidationResult?.isValid === "indeterminate") {
      complexityFulfilledPercentage = 100;
    } else if (complexityScore && !isEmptyValue) {
      complexityFulfilledPercentage = Math.min(
        (100 / (complexityScore.min + 1)) * (complexityScore.actual + 1),
        100,
      );
    }

    const policyValidationStatus = getStatusFromPolicyValidationResult(
      validationResultState?.isValid ?? policyValidationResult.isValid,
      policyValidationResult,
    );

    setState({
      status: policyValidationStatus,
      percentage: complexityFulfilledPercentage,
    });
  }, [policyValidationResult, isEmptyValue]);

  const complexityVisible = state.percentage !== -1;
  const complexityFulfilled = state.percentage === 100;

  const percentageClassName = clsx(
    styles.bar,
    isEmptyValue ? undefined : styles[`bar-background-status-${state.status}`],
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
