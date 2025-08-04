import { startTransition, useEffect } from "react";
import type { PolicyValidationResult } from "@/integrations/@mittwald/password-tools-js";
import { isPromise } from "remeda";
import type { Policy } from "@/integrations/@mittwald/password-tools-js";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";

export const usePolicyValidationResult = (
  validationPolicy: Policy,
  password: string,
  onValidationStart?: () => void,
  onValidationResult?: (data: {
    password: string;
    isValid: boolean;
    results: ResolvedPolicyValidationResult;
  }) => void,
) => {
  useEffect(() => {
    onValidationStart?.();
    validationPolicy.validate(password).then((validationResult) => {
      const setValidationResult = (
        password: string,
        policyValidationResult: PolicyValidationResult,
      ) => {
        const isValid = Boolean(policyValidationResult.isValid);
        onValidationResult?.({
          password,
          isValid,
          results: policyValidationResult as ResolvedPolicyValidationResult,
        });
      };

      startTransition(async () => {
        if (!isPromise(validationResult.isValid)) {
          return setValidationResult(password, validationResult);
        }

        void Promise.all([
          Promise.resolve(password),
          Promise.resolve(validationResult),
          ...validationResult.ruleResults,
        ]).then(
          ([
            resolvedValue,
            resolvedValidationResult,
            ...resolvedValidationRuleResults
          ]) => {
            startTransition(() => {
              setValidationResult(resolvedValue, {
                complexity: resolvedValidationResult.complexity,
                ruleResults: resolvedValidationRuleResults,
                isValid:
                  resolvedValidationResult.isValid &&
                  resolvedValidationRuleResults.every((r) => r.isValid),
              });
            });
          },
        );
      });
    });
  }, [password, validationPolicy]);
};
