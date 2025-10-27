import type { PolicyGenericDeclaration } from "@mittwald/password-tools-js/policy";
import { Policy } from "@mittwald/password-tools-js/policy";
import { defaultPasswordCreationPolicy } from "./";
import { isPromise } from "remeda";
import { useMemo } from "react";

export const generatePasswordCreationFieldValidation = (
  genericValidationPolicy: PolicyGenericDeclaration = defaultPasswordCreationPolicy,
) => {
  const validationPolicy = useMemo(
    () => Policy.fromDeclaration(genericValidationPolicy),
    [genericValidationPolicy],
  );

  return async (value: string) => {
    if (!value) {
      return true;
    }

    try {
      const validationResult = await validationPolicy.validate(value);

      if (isPromise(validationResult.isValid)) {
        return await validationResult.isValid;
      }

      return validationResult.isValid;
    } catch (ignoredError) {
      return false;
    }
  };
};
