import type { Policy } from "@/integrations/@mittwald/password-tools-js";
import { defaultPasswordCreationPolicy } from "@/components/PasswordCreationField/defaultPasswordCreationPolicy";
import { isPromise } from "remeda";

export const generatePasswordCreationFieldValidation =
  (validationPolicy: Policy = defaultPasswordCreationPolicy) =>
  async (value: string) => {
    if (!value) {
      return true;
    }

    const validationResult = validationPolicy.validate(value);

    if (isPromise(validationResult.isValid)) {
      return await validationResult.isValid;
    }

    return validationResult.isValid;
  };
