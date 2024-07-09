import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Label.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface LabelProps
  extends PropsWithChildren<Omit<Aria.LabelProps, "children">>,
    FlowComponentProps<HTMLLabelElement> {
  /** Whether the label should show an "optional" indicator. */
  optional?: boolean;
  /** Whether the label should be displayed as disabled. */
  isDisabled?: boolean;
  /* @internal */
  unstyled?: boolean;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Label = flowComponent("Label", (props) => {
  const {
    children,
    className,
    optional,
    isDisabled,
    ref,
    unstyled = false,
    ...rest
  } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const rootClassName = unstyled
    ? className
    : clsx(styles.label, isDisabled && styles.disabled, className);

  const optionalMarker = (
    <div className={styles.optional}>
      {stringFormatter.format("label.optional")}
    </div>
  );

  const propsContext: PropsContext = {
    ContextualHelpTrigger: { tunnelId: "contextualHelp" },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <TunnelProvider>
        <Aria.Label {...rest} className={rootClassName} ref={ref}>
          {children}
          {optional && optionalMarker}
          <TunnelExit id="contextualHelp" />
        </Aria.Label>
      </TunnelProvider>
    </PropsContextProvider>
  );
});

export default Label;
