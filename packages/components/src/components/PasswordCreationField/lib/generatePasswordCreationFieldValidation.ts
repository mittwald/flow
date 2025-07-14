import type { Policy } from "@mittwald/password-tools-js/policy";
import { defaultPasswordCreationPolicy } from "@/components/PasswordCreationField/defaultPasswordCreationPolicy";
import { isPromise } from "remeda";

export const generatePasswordCreationFieldValidation =
  (validationPolicy: Policy = defaultPasswordCreationPolicy) =>
  async (value: string) => {
    const validationResult = validationPolicy.validate(value);

    if (isPromise(validationResult.isValid)) {
      return await validationResult.isValid;
    }

    return validationResult.isValid;
  };
