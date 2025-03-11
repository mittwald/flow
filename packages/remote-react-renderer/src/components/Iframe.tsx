"use client";

import { type ComponentPropsWithRef, type ReactNode, useEffect } from "react";
import React, { useLayoutEffect, useRef, useState } from "react";

export type IFrameProps = ComponentPropsWithRef<"iframe"> & {
  fallback?: ReactNode;
};

export interface PromiseObject {
  loaded: boolean;
  promise: null | Promise<void>;
  resolve?: CallableFunction;
  reject?: CallableFunction;
}

function Iframe(props: IFrameProps) {
  const { onError, onLoad, src, ref, style, ...rest } = props;
  const awaiter = useRef<PromiseObject>({
    loaded: false,
    promise: null,
  }).current;

  const [, triggerLoad] = useState(false);
  const iframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (src && iframe.current) {
      awaiter.loaded = false;
      iframe.current.src = src;

      if (ref && typeof ref === "function") {
        return ref(iframe.current);
      }
    }
  }, [src, iframe]);

  useLayoutEffect(() => {
    if (!awaiter.loaded) {
      awaiter.promise = new Promise((resolve, reject) => {
        awaiter.resolve = () => {
          awaiter.promise = null;
          awaiter.loaded = true;
          resolve();
        };
        awaiter.reject = () => {
          awaiter.promise = null;
          awaiter.loaded = true;
          reject();
        };
      });

      triggerLoad(true);
    }
  }, [triggerLoad, awaiter.loaded]);

  if (awaiter.promise !== null) {
    throw awaiter.promise;
  }

  return (
    <iframe
      {...rest}
      style={
        style ??
        (awaiter.loaded
          ? undefined
          : {
              visibility: "hidden",
              height: 0,
              width: 0,
              border: "none",
              position: "absolute",
              marginLeft: "-9999px",
            })
      }
      ref={iframe}
      onLoad={(event) => {
        if (awaiter.resolve) {
          awaiter.resolve();
        }

        onLoad?.(event);
      }}
      onError={(err) => {
        if (awaiter.reject) {
          awaiter.reject();
        }
        onError?.(err);
      }}
    />
  );
}

export default Iframe;
