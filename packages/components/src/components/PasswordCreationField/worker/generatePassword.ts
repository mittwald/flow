import type { Policy } from "@mittwald/password-tools-js/policy";
import { Generator } from "@mittwald/password-tools-js/generator";

export const generatePassword = async (
  validationPolicy: Policy,
): Promise<string> => {
  return new Generator(validationPolicy).generatePassword();
};
