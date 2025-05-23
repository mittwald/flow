import type { Policy } from "@mittwald/password-tools-js/policy";
import { Generator } from "@mittwald/password-tools-js/generator";

export const useGeneratePassword = (
  validationPolicy: Policy,
): (() => Promise<string>) => {
  let resolvePromise: CallableFunction;
  let rejectPromise: CallableFunction;

  const waitingPromise = new Promise<string>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  return () => {
    if (typeof Worker === "undefined") {
      try {
        new Generator(validationPolicy).generatePassword().then((password) => {
          resolvePromise(password);
        });
      } catch (e) {
        rejectPromise(e);
      }
    } else {
      void import(`./passwordGeneration.worker?worker&inline`).then(
        (module) => {
          const worker = new module.default();
          worker.onmessage = (e: MessageEvent) => {
            const [action, data] = e.data;
            if (action === "generatePassword") {
              resolvePromise(data);
            } else if (action === "error") {
              rejectPromise(data);
            }
          };

          worker.postMessage([
            "generatePassword",
            JSON.stringify({
              ...validationPolicy,
              rules: [...validationPolicy.rules].map((r) => r.config),
            }),
          ]);
        },
      );
    }

    return waitingPromise;
  };
};
