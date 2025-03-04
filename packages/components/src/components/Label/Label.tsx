import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import * as Aria from "react-aria-components";
import styles from "./Label.module.scss";
import locales from "./locales/*.locale.json";

export interface LabelProps
  extends PropsWithChildren<Omit<Aria.LabelProps, "children">>,
    FlowComponentProps {
  /** Whether the label should show an "optional" indicator. */
  optional?: boolean;
  /** Whether the label should be displayed as disabled. */
  isDisabled?: boolean;
  /* @internal */
  unstyled?: boolean;
}

/** @flr-generate all */
export const Label = flowComponent<"Label", HTMLLabelElement>(
  "Label",
  (props) => {
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

    const optionalMarker = " " + stringFormatter.format("label.optional");

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
  },
);

export default Label;
