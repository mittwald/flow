import * as Aria from "react-aria-components";
import {
  Children,
  isValidElement,
  type Context,
  type FC,
  type ForwardedRef,
  type PropsWithChildren,
} from "react";

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
 * value prop on Inputs and TextAreas. This component uses React Arias context
 * prop API to only set the value prop, if it is present in the original
 * Input/TextArea component.
 *
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/textfield/src/useTextField.ts#L182
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/numberfield/src/useNumberField.ts#L206
 */
export const ReactAriaControlledValueFix: FC<
  ReactAriaControlledValueFixProps
> = (props) => {
  const { inputContext: context, children, props: originalInputProps } = props;

  const child = Children.only(children);
  if (!isValidElement<ChildProps>(child)) {
    throw new Error("Expected valid element");
  }

  const inputProps = child.props;
  const inputRef = inputProps["ref"];

  const [contextProps, contextRef] = Aria.useContextProps(
    inputProps,
    inputRef,
    context,
  );

  // Here does the workaround his job
  if (
    originalInputProps &&
    typeof originalInputProps === "object" &&
    !("value" in originalInputProps)
  ) {
    delete contextProps["value"];
  }

  return (
    <Aria.Provider values={[[context, { ...contextProps, ref: contextRef }]]}>
      {child}
    </Aria.Provider>
  );
};
