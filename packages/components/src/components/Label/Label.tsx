import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Label.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "./locales/*.locale.json";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { labelTunnelProviderId } from "./config";

export interface LabelProps
  extends
    PropsWithChildren<Omit<Aria.LabelProps, "children">>,
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
    ...rest
  } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "Label");

  const rootClassName = unstyled
    ? className
    : clsx(styles.label, isDisabled && styles.disabled, className);

  const optionalMarker = (
    <span className={styles.optional}>
      {stringFormatter.format("optional")}
    </span>
  );

  const propsContext: PropsContext = {
    ContextualHelpTrigger: {
      tunnelId: "contextualHelp",
      tunnelProviderId: labelTunnelProviderId,
      Button: {
        tunnelId: null,
        tunnelProviderId: null,
      },
    },
    Button: {
      tunnelId: "right",
      tunnelProviderId: labelTunnelProviderId,
      size: "s",
    },
    Action: {
      tunnelId: "right",
      tunnelProviderId: labelTunnelProviderId,
      Button: {
        tunnelId: null,
        tunnelProviderId: null,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <TunnelProvider id={labelTunnelProviderId}>
        <Aria.Label {...rest} className={rootClassName} ref={ref}>
          {children}
          {optional && optionalMarker}
          <TunnelExit id="contextualHelp" providerId={labelTunnelProviderId}>
            {(children) => {
              if (React.Children.count(children) >= 1) {
                return children;
              }

              return undefined;
            }}
          </TunnelExit>
          <TunnelExit id="right" providerId={labelTunnelProviderId}>
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
