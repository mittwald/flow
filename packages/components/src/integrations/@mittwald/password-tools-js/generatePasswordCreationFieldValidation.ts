import type { PolicyGenericDeclaration } from "@mittwald/password-tools-js/policy";
import { Policy } from "@mittwald/password-tools-js/policy";
import { defaultPasswordCreationPolicy } from "./";
import { isPromise } from "remeda";

export const generatePasswordCreationFieldValidation =
  (
    genericValidationPolicy: PolicyGenericDeclaration = defaultPasswordCreationPolicy,
  ) =>
  async (value: string) => {
    if (!value) {
      return true;
    }

    try {
      const validationPolicy = Policy.fromDeclaration(genericValidationPolicy);
      const validationResult = await validationPolicy.validate(value);

      if (isPromise(validationResult.isValid)) {
        return await validationResult.isValid;
      }

      return validationResult.isValid;
    } catch (ignoredError) {
      return false;
    }
  };
