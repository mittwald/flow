import React, { type FC } from "react";
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

  let complexityVisible;
  let status: ComplexityStatus;

  const complexityScore = policyValidationResult?.complexity;
  const rulesResults = policyValidationResult?.ruleResults ?? [];

  const complexityFulfilledPercentage = complexityScore
    ? Math.min(
        (100 / (complexityScore.min + 1)) * (complexityScore.actual + 1),
        100,
      )
    : 0;

  const validRules = rulesResults.filter((r) => r.isValid).length;
  const rulesFulfilledPercentage =
    rulesResults.length > 0 ? (validRules / rulesResults.length) * 100 : 0;

  let totalFulfilledPercentage = Math.round(
    complexityFulfilledPercentage * 0.8 + rulesFulfilledPercentage * 0.2,
  );

  if (isEmptyValue) {
    complexityVisible = false;
    totalFulfilledPercentage = 0;
    status = "success";
  } else {
    complexityVisible = true;
    status = getStatusFromPolicyValidationResult(
      validationResultState?.isValid ?? policyValidationResult.isValid,
      policyValidationResult,
    );
  }

  const complexityFulfilled = totalFulfilledPercentage === 100;

  const percentageClassName = clsx(
    styles.bar,
    !isEmptyValue && styles[`bar-background-status-${status}`],
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
      data-complexity-status={status}
      data-complexity-percentage={totalFulfilledPercentage}
      className={clsx(styles.complexityIndicator, {
        [styles.hide as string]: !complexityVisible,
      })}
    >
      <div
        style={{
          width: `${totalFulfilledPercentage}%`,
        }}
        className={percentageClassName}
      />
    </div>
  );
};

export default ComplexityIndicator;
