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
import { UiComponentTunnelExit } from "../UiComponentTunnel/UiComponentTunnelExit";

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
      tunnel: {
        id: "contextualHelp",
        component: "Label",
      },
      Button: {
        tunnel: null,
      },
    },
    Button: {
      tunnel: {
        id: "right",
        component: "Label",
      },
      size: "s",
    },
    Action: {
      tunnel: {
        id: "right",
        component: "Label",
      },
      Button: {
        tunnel: null,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <Aria.Label {...rest} className={rootClassName} ref={ref}>
        {children}
        {optional && optionalMarker}
        <UiComponentTunnelExit id="contextualHelp" component="Label">
          {(children) => {
            if (React.Children.count(children) >= 1) {
              return children;
            }

            return undefined;
          }}
        </UiComponentTunnelExit>
        <UiComponentTunnelExit id="right" component="Label">
          {(children) => {
            if (React.Children.count(children) >= 1) {
              return <div className={styles.right}>{children}</div>;
            }

            return undefined;
          }}
        </UiComponentTunnelExit>
      </Aria.Label>
    </PropsContextProvider>
  );
});

export default Label;
