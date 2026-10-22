import type { PropsWithChildren } from "react";
import styles from "./Badge.module.scss";
import clsx from "clsx";
import {
  alphaColors,
  decorativeColors,
  deprecatedDecorativeColors,
  isAlphaColor,
  type PropsWithClassName,
} from "@/lib/types/props";
import { useDeprecatedColor } from "@/lib/hooks/useDeprecatedColor";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PressEvent } from "@react-types/shared";
import { Button } from "@/components/Button";
import { IconClose } from "@/components/Icon/components/icons";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import { ContextualHelpButton } from "@/components/Badge/components/ContextualHelpButton";
import locales from "./locales/*.locale.json";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";

export const badgeColors = [
  "neutral",
  ...decorativeColors,
  "success",
  "warning",
  "danger",
  ...alphaColors,
] as const;

/**
 * Deprecated badge colors and the color each renders as (#3508). The status
 * hues are named by their meaning now, and the brand's green and orange are
 * `sage` and `salmon`.
 */
const deprecatedBadgeColors = {
  ...deprecatedDecorativeColors,
  green: "success",
  orange: "warning",
  red: "danger",
} as const;

export type BadgeColors =
  (typeof badgeColors)[number] | keyof typeof deprecatedBadgeColors;

export interface BadgeProps
  extends
    PropsWithChildren,
    FlowComponentProps<HTMLSpanElement>,
    PropsWithClassName {
  /** Handler that is called when the badge is pressed. */
  onPress?: (e: PressEvent) => void;
  /** Handler that is called when the badges close icon is pressed. */
  onClose?: (e: PressEvent) => void;
  /**
   * The color of the badge. @default "neutral"
   *
   * @deprecatedValues violet, teal, green, orange, red
   */
  color?: BadgeColors;
  /** Whether the badge is disabled. */
  isDisabled?: boolean;
}

const contextualHelpTunnel = {
  id: "contextualHelp",
  component: "Badge",
} as const;

/** @flr-generate all */
export const Badge = flowComponent("Badge", (props) => {
  const {
    children,
    className,
    color: colorFromProps = "neutral",
    ref,
    onPress,
    onClose,
    isDisabled,
    ...rest
  } = props;

  const color =
    useDeprecatedColor(colorFromProps, deprecatedBadgeColors) ?? "neutral";
  const stringFormatter = useLocalizedStringFormatter(locales, "Badge");
  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(
    styles.badge,
    styles[color],
    isDisabled && styles.disabled,
    isSkeleton && styles.skeleton,
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
    ContextualHelp: {
      tunnel: contextualHelpTunnel,
      wrapWith: (
        <ContextualHelpButton
          className={styles.action}
          color={buttonColor}
          isDisabled={isDisabled}
        />
      ),
    },
    // A trigger the consumer wrote brings its own button. It goes to the same
    // place, styled like the one the badge supplies.
    ContextualHelpTrigger: {
      tunnel: contextualHelpTunnel,
      Button: {
        className: styles.action,
        color: buttonColor,
        variant: "plain",
        size: "s",
        isDisabled,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      {/* The badge is one skeleton surface, its content draws none. */}
      <SkeletonModeReset>
        <span
          className={rootClassName}
          {...rest}
          ref={ref}
          inert={isSkeleton || undefined}
        >
          {!onPress && <span className={styles.content}>{children}</span>}
          {onPress && (
            <Button
              isDisabled={isDisabled}
              unstyled
              className={styles.button}
              onPress={onPress}
            >
              {children}
            </Button>
          )}

          <UiComponentTunnelExit
            id={contextualHelpTunnel.id}
            component="Badge"
          />

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
        </span>
      </SkeletonModeReset>
    </PropsContextProvider>
  );
});

export default Badge;
