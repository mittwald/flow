import type { PropsWithChildren } from "react";
import styles from "./Badge.module.scss";
import clsx from "clsx";
import {
  alphaColors,
  isAlphaColor,
  type PropsWithClassName,
} from "@/lib/types/props";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { ComponentPropsContext } from "@/lib/propsContext/types";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PressEvent } from "@react-types/shared";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import locales from "./locales/*.locale.json";

export const badgeColors = [
  "neutral",
  "blue",
  "navy",
  "violet",
  "teal",
  "lilac",
  "green",
  "orange",
  "red",
  ...alphaColors,
] as const;
export type BadgeColors = (typeof badgeColors)[number];

export interface BadgeProps
  extends PropsWithChildren, FlowComponentProps, PropsWithClassName {
  /** Handler that is called when the badge is pressed. */
  onPress?: (e: PressEvent) => void;
  /** Handler that is called when the badges close icon is pressed. */
  onClose?: (e: PressEvent) => void;
  /** The color of the badge. @default "neutral" */
  color?: BadgeColors;
  /** Whether the badge is disabled. */
  isDisabled?: boolean;
}

const actionTunnel = { id: "action", component: "Badge" } as const;

/** @flr-generate all */
export const Badge = flowComponent("Badge", (props) => {
  const {
    children,
    className,
    color = "neutral",
    ref,
    onPress,
    onClose,
    isDisabled,
    ...rest
  } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "Badge");

  const rootClassName = clsx(
    styles.badge,
    styles[color],
    isDisabled && styles.disabled,
    className,
  );

  const buttonColor = isAlphaColor(color) ? color : "dark";

  const propsContext: PropsContext = {
    Label: {
      elementType: "span",
      className: styles.scope,
      unstyled: true,
    },
    Text: {
      elementType: "span",
      className: styles.value,
    },
    Button: {
      Label: {
        elementType: "span",
        className: styles.scope,
        unstyled: true,
      },
      Text: {
        elementType: "span",
        className: styles.value,
      },
    },
  };

  const actionButtonContext: ComponentPropsContext<"Button"> = {
    className: styles.action,
    color: buttonColor,
    variant: "plain",
    size: "s",
    isDisabled,
  };

  const actionTriggerContext: ComponentPropsContext<"Action"> = {
    tunnel: actionTunnel,
    Button: {
      ...actionButtonContext,
      tunnel: null,
    },
  };

  const actionsPropsContext: PropsContext = {
    Button: {
      ...actionButtonContext,
      tunnel: actionTunnel,
    },
    CopyButton: {
      ...actionButtonContext,
      tunnel: actionTunnel,
    },
    Action: actionTriggerContext,
    ContextualHelpTrigger: actionTriggerContext,
    ModalTrigger: actionTriggerContext,
  };

  const content = (
    <PropsContextProvider props={actionsPropsContext}>
      {children}
    </PropsContextProvider>
  );

  return (
    <PropsContextProvider props={propsContext}>
      <div className={rootClassName} {...rest} ref={ref}>
        {!onPress && <div className={styles.content}>{content}</div>}
        {onPress && (
          <Button
            isDisabled={isDisabled}
            unstyled
            className={styles.button}
            onPress={onPress}
          >
            {content}
          </Button>
        )}

        <UiComponentTunnelExit id={actionTunnel.id} component="Badge" />

        {onClose && (
          <Button
            className={styles.close}
            size="s"
            color={buttonColor}
            variant="plain"
            onPress={onClose}
            isDisabled={isDisabled}
            aria-label={stringFormatter.format("remove")}
          >
            <IconClose />
          </Button>
        )}
      </div>
    </PropsContextProvider>
  );
});

export default Badge;
