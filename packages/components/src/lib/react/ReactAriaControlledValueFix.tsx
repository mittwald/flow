import * as Aria from "react-aria-components";
import {
  Children,
  isValidElement,
  type Context,
  type FC,
  type ForwardedRef,
  type PropsWithChildren,
  useRef,
  useEffect,
  useDeferredValue,
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

  const { ref, ...inputProps } = child.props;
  const [contextProps, contextRef] = Aria.useContextProps(
    inputProps,
    ref,
    context,
  );

  const elementRef = contextRef.current;
  const shouldIntercept =
    elementRef &&
    (elementRef instanceof HTMLInputElement ||
      elementRef instanceof HTMLTextAreaElement);

  const deferredValueFromContext = useDeferredValue(String(contextProps.value));
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!shouldIntercept) {
      return;
    }

    const onKeyDown = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
      }, 100);
    };

    elementRef?.addEventListener("keydown", onKeyDown);

    return () => {
      elementRef?.removeEventListener("keydown", onKeyDown);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [elementRef]);

  useEffect(() => {
    if (!shouldIntercept || timerRef.current) {
      return;
    }

    emitElementValueChange(elementRef, deferredValueFromContext);
  }, [deferredValueFromContext]);

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
