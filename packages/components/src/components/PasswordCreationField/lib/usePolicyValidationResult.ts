import { startTransition, useEffect, useRef } from "react";
import type { Policy } from "@/integrations/@mittwald/password-tools-js";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import { useDebouncedCallback } from "use-debounce";

/** @internal */
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
  /**
   * Validations resolve in any order. A result for a password that is no longer
   * the field's value would overwrite the current one.
   */
  const latestPassword = useRef(password);

  const validatePassword = (pwd: string) => {
    onValidationStart?.();

    startTransition(async () => {
      if (cache.current?.password === pwd) {
        onValidationResult?.({
          password: cache.current.password,
          isValid: Boolean(cache.current.results.isValid),
          results: cache.current.results,
        });
        return;
      }

      const validationResult = await validationPolicy.validate(pwd);
      if (pwd !== latestPassword.current) {
        return;
      }
      cache.current = { password: pwd, results: validationResult };
      onValidationResult?.({
        password: pwd,
        isValid: validationResult.isValid,
        results: validationResult,
      });
    });
  };

  const validatePasswordDebounce = useDebouncedCallback(validatePassword, 350, {
    trailing: true,
  });

  useEffect(() => {
    latestPassword.current = password;
    if (password) {
      validatePasswordDebounce(password);
    } else {
      validatePassword(password);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- validate on input changes only; the validators are new each render
  }, [password, validationPolicy]);

  /**
   * Stores a result the caller already has (a generated password), so the
   * validation of that password answers from the cache instead of rating it
   * again.
   */
  const rememberValidationResult = (
    pwd: string,
    results: ResolvedPolicyValidationResult,
  ) => {
    cache.current = { password: pwd, results };
  };

  return { rememberValidationResult } as const;
};
