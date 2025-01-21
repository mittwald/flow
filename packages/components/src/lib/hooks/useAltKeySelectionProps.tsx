import {
  type CSSProperties,
  type MouseEvent,
  type MouseEventHandler,
  type PointerEvent,
  type PointerEventHandler,
  useEffect,
  useState,
} from "react";

export const useAltKeySelectionProps = (props: NonNullable<unknown>) => {
  const styleFromProps =
    typeof props === "object" &&
    "style" in props &&
    typeof props.style === "object"
      ? (props.style as CSSProperties)
      : {};

  const [altKeyHolding, setAltKeyHolding] = useState(false);

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Alt") {
      setAltKeyHolding(false);
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Alt") {
      setAltKeyHolding(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handlePointerDown: PointerEventHandler = (e) => {
    handlePointerOrMouseDown(e);
  };
  const handleMouseDown: MouseEventHandler = (e) => {
    handlePointerOrMouseDown(e);
  };
  const handlePointerOrMouseDown = (e: MouseEvent | PointerEvent) => {
    if (altKeyHolding) {
      e.stopPropagation();
    }
  };
  const selectionStyle = altKeyHolding
    ? {
        cursor: "text",
      }
    : {};

  const style: CSSProperties = {
    ...selectionStyle,
    ...styleFromProps,
  };

  return {
    style,
    onPointerDown: handlePointerDown,
    onMouseDown: handleMouseDown,
  };
};
