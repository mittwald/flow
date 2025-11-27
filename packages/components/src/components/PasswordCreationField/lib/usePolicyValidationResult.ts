import { startTransition, useEffect, useRef } from "react";
import type {
  Policy,
  PolicyValidationResult,
} from "@/integrations/@mittwald/password-tools-js";
import { isPromise } from "remeda";
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
  const cache = useRef<{
    password: string;
    results: ResolvedPolicyValidationResult;
  } | null>(null);

  useEffect(() => {
    onValidationStart?.();

    if (cache.current?.password === password) {
      onValidationResult?.({
        password: cache.current.password,
        isValid: Boolean(cache.current.results.isValid),
        results: cache.current.results,
      });
      return;
    }

    validationPolicy.validate(password).then((validationResult) => {
      const setValidationResult = (
        password: string,
        policyValidationResult: PolicyValidationResult,
      ) => {
        const results =
          policyValidationResult as ResolvedPolicyValidationResult;
        const isValid = Boolean(policyValidationResult.isValid);

        cache.current = { password, results };
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
