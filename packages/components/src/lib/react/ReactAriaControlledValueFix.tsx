import * as Aria from "react-aria-components";
import {
  Children,
  isValidElement,
  type Context,
  type FC,
  type PropsWithChildren,
  useDeferredValue,
  useLayoutEffect,
  useEffect,
  useRef,
  createContext,
  useContext,
  useState,
  type RefObject,
} from "react";
import { emitElementValueChange } from "@/lib/react/emitElementValueChange";
import { useOptionalFormContext } from "@/integrations/react-hook-form";

interface ChildProps {
  [key: string]: unknown;
  id?: string;
  ref?: RefObject<never>;
  inputRef?: RefObject<never>;
}

export interface ReactAriaControlledValueFixProps extends PropsWithChildren {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputContext?: Context<Aria.ContextValue<any, any>>;
}

export const ReactAriaControlledValueContext = createContext<
  Pick<ReactAriaControlledValueFixProps, "inputContext">
>({});

export const ReactAriaControlledValueProvider: FC<
  PropsWithChildren & Pick<ReactAriaControlledValueFixProps, "inputContext">
> = (props) => {
  const { children, inputContext } = props;
  const context = useContext(ReactAriaControlledValueContext);

  return (
    <ReactAriaControlledValueContext
      value={{
        inputContext: context.inputContext
          ? context.inputContext
          : inputContext,
      }}
    >
      {children}
    </ReactAriaControlledValueContext>
  );
};

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
  const { inputContext: inputContextFromProps = undefined, children } = props;

  const { inputContext: inputContextFromContext = inputContextFromProps } =
    useContext(ReactAriaControlledValueContext);

  const child = Children.only(children);
  if (!isValidElement<ChildProps>(child)) {
    throw new Error("Expected valid element");
  }

  const isInteractingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isInteracting = useRef<"idle" | "interacting">("idle");
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

  const { ref, inputRef, ...childProps } = child.props;

  const [ariaInputContextProps, ariaInputContextRef] = Aria.useContextProps(
    childProps,
    null,
    Aria.InputContext as never,
  );

  const elementRef =
    inputRef?.current ?? ref?.current ?? ariaInputContextRef.current;

  const deferredValueFromContext = useDeferredValue(
    ariaInputContextProps.value !== undefined
      ? String(ariaInputContextProps.value)
      : "",
  );

  const isValidElementType =
    elementRef &&
    (elementRef instanceof HTMLInputElement ||
      elementRef instanceof HTMLTextAreaElement);

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

      isInteracting.current = "interacting";

      if (isInteractingTimeoutRef.current) {
        clearTimeout(isInteractingTimeoutRef.current);
      }

      isInteractingTimeoutRef.current = setTimeout(() => {
        isInteracting.current = "idle";
      }, 100);
    };
    const onBlur = () => {
      isInteracting.current = "idle";
    };

    elementRef.addEventListener("keypress", onKeyDown);
    elementRef.addEventListener("blur", onBlur);

    return () => {
      elementRef.removeEventListener("keypress", onKeyDown);
      elementRef.removeEventListener("blur", onBlur);
    };
  }, [elementRef]);

  useLayoutEffect(() => {
    if (!isValidElementType) {
      return;
    }

    if (isInteracting.current === "interacting") {
      return;
    }

    emitElementValueChange(elementRef, deferredValueFromContext);
  }, [deferredValueFromContext, forceUpdate]);

  const optionalFormContext = useOptionalFormContext();
  useEffect(() => {
    if (!optionalFormContext?.ref) {
      return;
    }

    const onReset = (event: Event) => {
      event.preventDefault();
      setForceUpdate((o) => !o);
    };

    optionalFormContext.ref.current?.addEventListener("reset", onReset);

    return () => {
      optionalFormContext.ref.current?.removeEventListener("reset", onReset);
    };
  }, [optionalFormContext?.ref]);

  const uncontrolledContextProps = {
    ...ariaInputContextProps,
    value: undefined,
    ref: ariaInputContextRef,
  };

  const providerValues: unknown[] = [
    [Aria.InputContext, uncontrolledContextProps],
  ];

  if (inputContextFromContext) {
    providerValues.push([inputContextFromContext, uncontrolledContextProps]);
  }

  return (
    <Aria.Provider values={providerValues as never}>{children}</Aria.Provider>
  );
};
