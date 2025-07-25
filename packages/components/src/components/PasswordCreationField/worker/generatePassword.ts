import { Generator } from "@/integrations/@mittwald/password-tools-js";
import type { Policy } from "@/integrations/@mittwald/password-tools-js";

export const generatePassword = async (
  validationPolicy: Policy,
): Promise<string> => {
  return new Generator(validationPolicy).generatePassword();
};
