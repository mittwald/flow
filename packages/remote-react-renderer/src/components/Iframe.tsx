import type { ComponentPropsWithRef } from "react";
import React, { Suspense, useLayoutEffect, useRef, useState } from "react";

type IFrameProps = ComponentPropsWithRef<"iframe"> & {
  fallback?: JSX.Element;
};

export function IFrame(props: IFrameProps) {
  const { fallback, ...rest } = props;

  return (
    <Suspense fallback={fallback}>
      <IFrameImplementation {...rest} />
    </Suspense>
  );
}

interface PromiseObject {
  promise: null | Promise<void>;
  resolve: null | CallableFunction;
  reject: null | CallableFunction;
}

function IFrameImplementation(props: ComponentPropsWithRef<"iframe">) {
  const { onError, onLoad, ...rest } = props;
  const awaiter = useRef<PromiseObject>({
    promise: null,
    resolve: null,
    reject: null,
  }).current;

  const [, triggerLoad] = useState(false);

  if (awaiter?.promise) {
    throw awaiter.promise;
  }

  useLayoutEffect(() => {
    if (awaiter.promise === null) {
      awaiter.promise = new Promise<void>((resolve, reject) => {
        Object.assign(awaiter, { resolve, reject });
      });

      triggerLoad(true);
    }
  }, []);

  return (
    <iframe
      {...rest}
      onLoad={(e) => {
        awaiter.promise = null;

        if (awaiter.resolve) {
          awaiter.resolve();
          awaiter.resolve = null;
        }

        onLoad?.(e);
      }}
      onError={(err) => {
        awaiter.promise = null;

        if (awaiter.reject) {
          awaiter.reject();
          awaiter.reject = null;
        }
        onError?.(err);
      }}
    />
  );
}

export default IFrame;
