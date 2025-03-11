"use client";

import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type FC,
  type ReactNode,
  useEffect,
} from "react";
import React, { useLayoutEffect, useRef, useState } from "react";

type IFrameProps = ComponentPropsWithRef<"iframe"> & {
  fallback?: ReactNode;
};

interface PromiseObject {
  loaded: boolean;
  promise: null | Promise<void>;
  resolve?: CallableFunction;
  reject?: CallableFunction;
}

export const HiddenIframeStyle: CSSProperties = {
  visibility: "hidden",
  height: 0,
  width: 0,
  border: "none",
  position: "absolute",
  marginLeft: "-9999px",
};

const Iframe: FC<IFrameProps> = (props) => {
  const { onError, onLoad, src, ref, style, ...rest } = props;
  const awaiter = useRef<PromiseObject>({
    loaded: false,
    promise: null,
  }).current;

  const [, forceRerender] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (src && iframeRef.current) {
      awaiter.loaded = false;
      iframeRef.current.src = src;

      if (ref && typeof ref === "function") {
        return ref(iframeRef.current);
      }
    }
  }, [src, iframeRef]);

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

      forceRerender(true);
    }
  }, [forceRerender, awaiter.loaded]);

  if (awaiter.promise !== null) {
    throw awaiter.promise;
  }

  return (
    <iframe
      {...rest}
      style={style ?? (awaiter.loaded ? undefined : HiddenIframeStyle)}
      ref={iframeRef}
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
};

export default Iframe;
