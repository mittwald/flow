import { Generator } from "@mittwald/password-tools-js/generator";
import { Policy } from "@mittwald/password-tools-js/policy";

self.onmessage = async (e) => {
  try {
    const [action, data] = e.data;

    if (action === "generatePassword" && data) {
      const policyDeclaration = JSON.parse(data);
      const policy = Policy.fromDeclaration(policyDeclaration);
      const generator = new Generator(policy);

      self.postMessage([action, await generator.generatePassword()]);
    }
  } catch (error) {
    self.postMessage(["error", error.message]);
  }
};
