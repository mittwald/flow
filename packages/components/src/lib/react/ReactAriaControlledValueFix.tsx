import * as Aria from "react-aria-components";
import {
  Children,
  isValidElement,
  type Context,
  type FC,
  type ForwardedRef,
  type PropsWithChildren,
  useDeferredValue,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from "react";
import { emitElementValueChange } from "@/lib/react/emitElementValueChange";

export interface ReactAriaControlledValueFixProps extends PropsWithChildren {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputContext: Context<any>;
  props: unknown;
}

interface ChildProps {
  [key: string]: unknown;
  ref: ForwardedRef<Element>;
  inputRef: ForwardedRef<Element>;
}

/**
 * React Aria (accidentally?!) enforces controlled inputs by always setting the
 * value prop on Inputs and TextAreas with its context props API. This component
 * also uses this API to only unset the value prop. Furthermore setting an input
 * value is finally done by directly on the DOM element.
 *
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/textfield/src/useTextField.ts#L182
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/numberfield/src/useNumberField.ts#L206
 */
export const ReactAriaControlledValueFix: FC<
  ReactAriaControlledValueFixProps
> = (props) => {
  const { inputContext: context, children } = props;

  const child = Children.only(children);
  if (!isValidElement<ChildProps>(child)) {
    throw new Error("Expected valid element");
  }

  const { ref, inputRef, ...inputProps } = child.props;
  const [contextProps, contextRef] = Aria.useContextProps(
    inputProps,
    inputRef ?? ref,
    context,
  );

  const elementRef = contextRef.current;
  const isInteractingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [isInteracting, setIsInteracting] = useState(false);

  const isValidElementType =
    elementRef &&
    (elementRef instanceof HTMLInputElement ||
      elementRef instanceof HTMLTextAreaElement);

  const deferredValueFromContext = useDeferredValue(
    String(contextProps.value ?? ""),
  );

  useEffect(() => {
    if (!isValidElementType || !elementRef) {
      return;
    }

    // sync the last known value when element reference is available
    emitElementValueChange(elementRef, deferredValueFromContext);

    const onKeyDown = (event: Event) => {
      if (!event.isTrusted) {
        return;
      }
      setIsInteracting(() => true);

      if (isInteractingTimeoutRef.current) {
        clearTimeout(isInteractingTimeoutRef.current);
      }
      isInteractingTimeoutRef.current = setTimeout(() => {
        setIsInteracting(() => false);
      }, 100);
    };
    const onBlur = () => {
      setIsInteracting(() => false);
    };

    elementRef.addEventListener("keydown", onKeyDown);
    elementRef.addEventListener("blur", onBlur);

    return () => {
      elementRef.removeEventListener("keydown", onKeyDown);
      elementRef.removeEventListener("blur", onBlur);

      if (isInteractingTimeoutRef.current) {
        clearTimeout(isInteractingTimeoutRef.current);
      }
    };
  }, [elementRef]);

  useLayoutEffect(() => {
    if (!isValidElementType || isInteracting) {
      return;
    }
    const {
      selectionStart: originalSelectionStart,
      selectionEnd: originalSelectionEnd,
    } = elementRef;

    emitElementValueChange(elementRef, deferredValueFromContext);

    const { selectionStart, selectionEnd } = elementRef;
    if (selectionStart !== originalSelectionStart) {
      elementRef.selectionStart = originalSelectionStart;
    }
    if (selectionEnd !== originalSelectionEnd) {
      elementRef.selectionEnd = originalSelectionEnd;
    }
  }, [deferredValueFromContext, isInteracting]);

  const uncontrolledContextProps = {
    ...contextProps,
    value: undefined,
    ref: contextRef,
  };

  return (
    <Aria.Provider values={[[context, uncontrolledContextProps]]}>
      {child}
    </Aria.Provider>
  );
};
