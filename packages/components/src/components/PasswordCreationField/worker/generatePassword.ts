import type { Policy } from "@mittwald/password-tools-js/policy";
import { Generator } from "@mittwald/password-tools-js/generator";

export const generatePassword = async (
  validationPolicy: Policy,
): Promise<string> => {
  if (typeof Worker === "undefined") {
    return new Generator(validationPolicy).generatePassword();
  }

  const { default: GeneratorWorker } = await import(
    `./passwordGeneration.worker?worker&inline`
  );

  const worker = new GeneratorWorker();
  return new Promise((resolve, reject) => {
    worker.onmessage = (e: MessageEvent) => {
      const [action, data] = e.data;
      if (action === "generatePassword") {
        resolve(data);
      } else if (action === "error") {
        reject(data);
      }
    };

    worker.postMessage([
      "generatePassword",
      JSON.stringify({
        ...validationPolicy,
        rules: [...validationPolicy.rules].map((r) => r.config),
      }),
    ]);
  });
};
