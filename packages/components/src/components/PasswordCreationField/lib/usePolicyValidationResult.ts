import { startTransition, useEffect, useRef } from "react";
import type { Policy } from "@/integrations/@mittwald/password-tools-js";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import { useDebouncedCallback } from "use-debounce";

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
    if (password) {
      validatePasswordDebounce(password);
    } else {
      validatePassword(password);
    }
  }, [password, validationPolicy]);
};
