import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Label.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { useLocalizedStringFormatter, useVisuallyHidden } from "react-aria";
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

/** @flr-generate all */
export const Label = flowComponent("Label", (props) => {
  const {
    children,
    className,
    optional,
    isDisabled,
    ref,
    unstyled = false,
    hidden,
    ...rest
  } = props;

  const { visuallyHiddenProps } = useVisuallyHidden();
  const stringFormatter = useLocalizedStringFormatter(locales);

  const rootClassName = unstyled
    ? className
    : clsx(styles.label, isDisabled && styles.disabled, className);

  const optionalMarker = (
    <span className={styles.optional}>
      {stringFormatter.format("label.optional")}
    </span>
  );

  const propsContext: PropsContext = {
    ContextualHelpTrigger: {
      tunnelId: "contextualHelp",
      Button: {
        tunnelId: null,
      },
    },
    Button: {
      tunnelId: "right",
      size: "s",
    },
    Action: {
      tunnelId: "right",
      Button: {
        tunnelId: null,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <TunnelProvider>
        <Aria.Label
          {...rest}
          {...(hidden ? visuallyHiddenProps : {})}
          className={rootClassName}
          ref={ref}
          hidden={hidden}
        >
          {children}
          {optional && optionalMarker}
          <TunnelExit id="contextualHelp">
            {(children) => {
              if (React.Children.count(children) >= 1) {
                return children;
              }

              return undefined;
            }}
          </TunnelExit>
          <TunnelExit id="right">
            {(children) => {
              if (React.Children.count(children) >= 1) {
                return <div className={styles.right}>{children}</div>;
              }

              return undefined;
            }}
          </TunnelExit>
        </Aria.Label>
      </TunnelProvider>
    </PropsContextProvider>
  );
});

export default Label;
