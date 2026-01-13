import type { PolicyGenericDeclaration } from "@mittwald/password-tools-js/policy";
import { Policy } from "@mittwald/password-tools-js/policy";
import { defaultPasswordCreationPolicy } from ".";
import { useMemo, useRef } from "react";
import type { Validate } from "react-hook-form";

export const usePasswordCreationFieldValidation = (
  genericValidationPolicy: PolicyGenericDeclaration = defaultPasswordCreationPolicy,
): Validate<string, unknown> => {
  const validationPolicy = useMemo(
    () => Policy.fromDeclaration(genericValidationPolicy),
    [genericValidationPolicy],
  );

  const cache = useRef<{
    password: string;
    isValid: boolean;
  } | null>(null);

  return async (value) => {
    if (value === "") {
      return;
    }

    if (cache.current?.password === value) {
      return cache.current.isValid;
    }

    try {
      const validationResult = await validationPolicy.validate(value);
      const isValid = await validationResult.isValid;

      cache.current = {
        password: value,
        isValid,
      };
      return isValid;
    } catch (ignoredError) {
      return false;
    }
  };
};

/** @deprecated Use `usePasswordCreationFieldValidation` instead. */
export const generatePasswordCreationFieldValidation =
  usePasswordCreationFieldValidation;
