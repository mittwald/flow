import { ExtBridgeError } from "@/error";

export const controllablePromise = () => {
  let resolve = (): void => {
    throw new ExtBridgeError("Unexpected call of resolve()");
  };

  let reject: (error: unknown) => void = () => {
    throw new ExtBridgeError("Unexpected call of reject()");
  };

  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return [promise, resolve, reject] as const;
};
