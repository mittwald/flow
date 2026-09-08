import { type PropsWithChildren } from "react";
import { Children, useEffect, useRef } from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Option.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { extractTextFromChildren } from "@/lib/react/remote";
import { IconCheck } from "@/components/Icon/components/icons";

export interface OptionProps
  extends
    Omit<Aria.ListBoxItemProps, "children" | "value" | "id">,
    PropsWithChildren,
    FlowComponentProps {
  /**
   * The value this option contributes to the field's selection, and the key
   * `defaultValue` / `value` of the surrounding field target.
   *
   * Defaults to `textValue`, which itself defaults to the text among the
   * option's children — element children such as a `Badge` do not contribute,
   * so `<Option>Millennium Falcon <Badge>Latest</Badge></Option>` is
   * `"Millennium Falcon"`. Pass it explicitly when the value must not follow
   * the display text, or when the children carry no text at all.
   */
  value?: string | number;
}

/** @flr-generate all */
export const Option = flowComponent("Option", (props) => {
  const {
    className,
    children,
    textValue = extractTextFromChildren(children),
    value = textValue,
    ref,
    ...rest
  } = props;

  useWarnMissingValue(value === undefined);

  const rootClassName = clsx(styles.option, className);
  const hasChildren = Children.count(children) >= 1;

  return (
    <Aria.ListBoxItem
      className={rootClassName}
      ref={ref}
      id={value}
      {...rest}
      textValue={textValue}
    >
      <span className={styles.content}>
        {hasChildren ? children : textValue}
      </span>
      <IconCheck aria-hidden className={styles.checkMark} />
    </Aria.ListBoxItem>
  );
});

/*
 * Without an `id`, react-aria gives the item a key off a render-order counter
 * (`react-aria-1`). That key is what the field reports as its selected value
 * and what `defaultValue` has to match, so an option without a `value` silently
 * submits a meaningless string and cannot be preselected — and the key shifts
 * when unrelated markup around it changes. react-aria warns about the missing
 * `textValue` in this situation but says nothing about the key, which is the
 * expensive half (#3028).
 *
 * Warn in an effect rather than during render, so a double render in StrictMode
 * does not log twice; the ref keeps it to once per option.
 */
const useWarnMissingValue = (isMissing: boolean): void => {
  const hasWarned = useRef(false);

  useEffect(() => {
    if (!isMissing || hasWarned.current) {
      return;
    }

    hasWarned.current = true;
    console.error(
      "An <Option> has no 'value' and none could be inferred from its children, so it falls back to a generated, render-order-dependent key. Pass a 'value' to give the option a stable key.",
    );
  }, [isMissing]);
};

export default Option;
