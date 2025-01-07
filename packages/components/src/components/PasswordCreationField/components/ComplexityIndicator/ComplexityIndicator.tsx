import type { FC } from "react";
import React from "react";
import styles from "./ComplexityIndicator.module.scss";
import { getStatusFromPolicyValidationResult } from "@/components/PasswordCreationField/lib/getStatusFromPolicyValidationResult";
import clsx from "clsx";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";

export interface ComplexityIndicatorProps {
  isLoading: boolean;
  policyValidationResult?: ResolvedPolicyValidationResult;
}

/** @internal */
export const ComplexityIndicator: FC<ComplexityIndicatorProps> = (props) => {
  const { policyValidationResult, isLoading } = props;

  const complexity = policyValidationResult?.complexity;

  const complexityFulfilledPercentage =
    complexity && !policyValidationResult?.isEmptyValueValidation
      ? Math.min((100 / (complexity.min + 1)) * (complexity.actual + 1), 100)
      : 0;

  const policyValidationStatus = getStatusFromPolicyValidationResult(
    policyValidationResult,
  );

  return (
    <div
      aria-hidden={true}
      data-container="complexity"
      data-complexity-visible={complexityFulfilledPercentage !== 0}
      data-complexity-status={policyValidationStatus}
      className={clsx(
        styles.complexityContainer,
        complexityFulfilledPercentage === 0 && styles.complexityContainerHide,
      )}
    >
      <div
        style={{
          width: `${complexityFulfilledPercentage}%`,
        }}
        className={clsx(
          styles.complexity,
          styles[`complexity-background-status-${policyValidationStatus}`],
          isLoading && styles.loading,
          complexityFulfilledPercentage !== 100 && styles.complexityRunning,
        )}
      />
    </div>
  );
};

export default ComplexityIndicator;
