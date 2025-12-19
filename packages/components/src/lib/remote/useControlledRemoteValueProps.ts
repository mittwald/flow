import { useRef } from "react";
import { getRemoteEvent } from "./eventHandlerContext";
import type { FieldProps } from "@/lib/remote/types";

const unknownRemoteEventValue = Symbol("unknownRemoteEventValue");

export const controlledRemoteValueMarker = "___flowControlledRemoteValue___";

export const useControlledRemoteValueProps = <T, P>(
  props: FieldProps<T, P>,
) => {
  const valueOfRemoteEvent = useRef<unknown>(unknownRemoteEventValue);

  const onChange = (value: T) => {
    const remoteEvent = getRemoteEvent();
    valueOfRemoteEvent.current = remoteEvent ? value : unknownRemoteEventValue;
    props.onChange?.(value);
  };

  const value =
    valueOfRemoteEvent.current === props.value
      ? controlledRemoteValueMarker
      : props.value;

  return { ...props, onChange, value };
};
