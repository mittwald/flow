import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Label.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface LabelProps
  extends PropsWithChildren<Omit<Aria.LabelProps, "children">>,
    FlowComponentProps {
  optional?: boolean;
  isDisabled?: boolean;
  /* @internal */
  unstyled?: boolean;
}

export const Label = flowComponent("Label", (props) => {
  const {
    children,
    className,
    optional,
    isDisabled,
    refProp: ref,
    unstyled = false,
    ...rest
  } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const rootClassName = unstyled
    ? className
    : clsx(styles.label, isDisabled && styles.disabled, className);

  const optionalMarker = " " + stringFormatter.format("label.optional");

  return (
    <ClearPropsContext>
      <Aria.Label {...rest} className={rootClassName} ref={ref}>
        {children}
        {optional && optionalMarker}
      </Aria.Label>
    </ClearPropsContext>
  );
});

export default Label;
