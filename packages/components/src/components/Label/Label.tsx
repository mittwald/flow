import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./Label.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import {
  overlayTriggersTunneledTo,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "./locales/*.locale.json";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import { SkeletonTextContent } from "@/components/SkeletonMode/components/SkeletonTextContent";
import { useSkeletonMode } from "@/components/SkeletonMode/skeletonModeContext";

export interface LabelProps
  extends
    PropsWithChildren<Omit<Aria.LabelProps, "children">>,
    FlowComponentProps<HTMLLabelElement> {
  /** Whether the label should show an "optional" indicator. */
  optional?: boolean;
  /** Whether the label should be displayed as disabled. */
  isDisabled?: boolean;
  /** @internal */
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

  const [labelProps, labelRef] = Aria.useContextProps(
    rest,
    ref,
    Aria.LabelContext,
  );
  const { id, ...rootProps } = labelProps;

  const stringFormatter = useLocalizedStringFormatter(locales, "Label");
  const isSkeleton = useSkeletonMode();

  const rootClassName = unstyled
    ? className
    : clsx(styles.label, isDisabled && styles.disabled, className);

  const optionalMarker = (
    <span className={styles.optional}>
      {stringFormatter.format("optional")}
    </span>
  );

  const rightTunnel = {
    id: "right",
    component: "Label",
  } as const;

  const propsContext: PropsContext = {
    ...overlayTriggersTunneledTo(rightTunnel),
    // The contextual help sits next to the label text, not with the actions.
    ContextualHelpTrigger: {
      tunnel: {
        id: "contextualHelp",
        component: "Label",
      },
    },
    Button: {
      tunnel: rightTunnel,
      size: "s",
    },
    Action: {
      tunnel: rightTunnel,
      Button: {
        tunnel: null,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      {/* The context is already merged into `labelProps` above. */}
      <Aria.LabelContext.Provider value={null}>
        <Aria.Label
          {...rootProps}
          className={rootClassName}
          ref={labelRef}
          inert={isSkeleton || undefined}
        >
          {/*
           * Fields point `aria-labelledby` at the label's id, and the name
           * computation takes every descendant's name, buttons included. The
           * id sits on this span so the tunnelled buttons stay out of it.
           */}
          <span id={id} className={styles.text}>
            <SkeletonTextContent defaultWidth="6em">
              {children}
              {optional && optionalMarker}
            </SkeletonTextContent>
          </span>
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
      </Aria.LabelContext.Provider>
    </PropsContextProvider>
  );
});

export default Label;
