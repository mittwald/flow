import PasswordGeneratorWorker from "./passwordGeneration.worker?worker";
import type { Policy } from "@mittwald/password-tools-js/policy";

const worker = new PasswordGeneratorWorker();

export const generatePassword = (validationPolicy: Policy): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    worker.postMessage([
      "generatePassword",
      JSON.stringify({
        ...validationPolicy,
        rules: [...validationPolicy.rules].map((r) => r.config),
      }),
    ]);

    worker.onmessage = (e) => {
      const [action, data] = e.data;
      if (action === "generatePassword") {
        resolve(data);
      } else if (action === "error") {
        reject(data);
      }
    };
  });
};
