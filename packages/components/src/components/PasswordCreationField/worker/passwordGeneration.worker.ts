import { Generator } from "@/integrations/@mittwald/password-tools-js";
import { Policy } from "@/integrations/@mittwald/password-tools-js";

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
    if (error instanceof Error) {
      self.postMessage(["error", error.message]);
    } else {
      self.postMessage(["error", error]);
    }
  }
};
