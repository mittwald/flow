import type { PropsWithChildren } from "react";
import styles from "./Button.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { IconFailed, IconSucceeded } from "@/components/Icon/components/icons";
import { Wrap } from "@/components/Wrap";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useAriaAnnounceActionState } from "@/components/Action/lib/ariaLive";
import { containsTextChild } from "@/lib/react/remote";
import type { AlphaColor } from "@/lib/types/props";
import { filterDOMProps } from "@react-aria/utils";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";

export interface ButtonProps
  extends
    PropsWithChildren<Aria.ButtonProps>,
    FlowComponentProps<HTMLButtonElement> {
  /**
   * Slot for button placement in action groups: `primary` (at the end),
   * `secondary` (before the primary action) or `abort` (at the start). Without
   * a slot, an action group places the colors primary, success and danger in
   * `primary` and every other color in `abort`. A secondary-colored button that
   * does not abort therefore needs `slot="secondary"`.
   */
  slot?: string;
  /**
   * The color of the button.
   *
   * @default "primary"
   * @deprecatedValues accent
   */
  color?:
    "primary" | "success" | "secondary" | "danger" | AlphaColor | "accent";
  /** The visual variant of the button. @default "solid" */
  variant?: "plain" | "solid" | "soft" | "outline";
  /** The size of the button. @default "m" */
  size?: "m" | "s";
  /** Disables button but keeps it focusable. */
  "aria-disabled"?: boolean;
  /** Whether the button is in a pending state. */
  isPending?: boolean;
  /** Whether the button is in a succeeded state. */
  isSucceeded?: boolean;
  /** Whether the button is in a failed state. */
  isFailed?: boolean;
  /** Whether the button is in a read only state. */
  isReadOnly?: boolean;
  /** @internal */
  unstyled?: boolean;
  /** @internal */
  ariaSlot?: string | null;
  /** @internal */
  elementType?: "button" | "span";
}

const isMuted = (props: ButtonProps) =>
  !!(
    props.isPending ||
    props.isSucceeded ||
    props.isFailed ||
    props["aria-disabled"] ||
    props.isReadOnly
  );

const disablePendingProps = (props: ButtonProps) => {
  if (isMuted(props)) {
    props = { ...props };

    const mutedActionHandler = (e: unknown) => {
      if (e && typeof e === "object") {
        // stopPropagation is the default behavior in React Aria
        const isReactAriaEvent =
          "continuePropagation" in e &&
          typeof e.continuePropagation === "function";

        if (
          !isReactAriaEvent &&
          "stopPropagation" in e &&
          typeof e.stopPropagation === "function"
        ) {
          e.stopPropagation();
        }
        if ("preventDefault" in e && typeof e.preventDefault === "function") {
          e.preventDefault();
        }
      }

      return false;
    };

    props.onClick = mutedActionHandler;
    props.onPress = mutedActionHandler;
    props.onPressStart = mutedActionHandler;
    props.onPressEnd = mutedActionHandler;
    props.onPressChange = mutedActionHandler;
    props.onPressUp = mutedActionHandler;
    props.onKeyDown = mutedActionHandler;
    props.onKeyUp = mutedActionHandler;
  }

  return props;
};

/** @flr-generate all */
export const Button = flowComponent("Button", (props) => {
  const muted = isMuted(props);
  props = disablePendingProps(props);

  const warnDeprecation = useWarnDeprecation();
  const isSkeleton = useSkeletonMode();

  const {
    color: colorFromProps = "primary",
    variant = "solid",
    children,
    className,
    size = "m",
    isPending,
    isSucceeded,
    isFailed,
    "aria-disabled": ariaDisabled,
    ref,
    slot: ignoredSlotProp,
    ariaSlot: slot,
    unstyled,
    isReadOnly,
    elementType,
    ...restProps
  } = props;

  if (colorFromProps === "accent") {
    warnDeprecation(
      "The color 'accent' is deprecated and will be removed in a future release. Use 'success' instead.",
    );
  }

  const color = colorFromProps === "accent" ? "success" : colorFromProps;

  /**
   * A string child renders no element the CSS could match, so the button itself
   * carries the marker. An explicit `Text` child is matched by `:has(.text)`.
   */
  const hasText = containsTextChild(children);

  const rootClassName = unstyled
    ? className
    : clsx(
        styles.button,
        isPending && styles.isPending,
        isSucceeded && styles.isSucceeded,
        isFailed && styles.isFailed,
        size === "s" && styles["size-s"],
        styles[color],
        styles[variant],
        ariaDisabled && styles.ariaDisabled,
        hasText && styles.hasText,
        isSkeleton && styles.skeleton,
        className,
      );

  useAriaAnnounceActionState(
    isPending
      ? "isPending"
      : isSucceeded
        ? "isSucceeded"
        : isFailed
          ? "isFailed"
          : "isIdle",
  );

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
      "aria-hidden": true,
      size,
    },
    Text: {
      className: styles.text,
    },
    Avatar: {
      className: styles.avatar,
    },
    CounterBadge: {
      className: styles.counterBadge,
    },
    Image: {
      className: styles.image,
    },
  };

  const stateIcon = isSucceeded ? (
    <IconSucceeded size={size} className={styles.stateIcon} color="success" />
  ) : isFailed ? (
    <IconFailed size={size} className={styles.stateIcon} color="danger" />
  ) : isPending ? (
    <LoadingSpinner size={size} className={styles.stateIcon} />
  ) : undefined;

  const buttonContent = (
    <>
      <PropsContextProvider props={propsContext}>
        <Wrap if={!unstyled}>
          <span className={styles.content}>{children}</span>
        </Wrap>
      </PropsContextProvider>
      {stateIcon}
    </>
  );

  /* A styled button is one skeleton surface, so its content draws no skeleton
     of its own. An unstyled button draws no surface, so its content does. */
  const content = (
    <Wrap if={!unstyled}>
      <SkeletonModeReset>{buttonContent}</SkeletonModeReset>
    </Wrap>
  );

  if (elementType === "span") {
    const spanProps = filterDOMProps(restProps, { global: true });

    return (
      <span
        {...spanProps}
        inert={isSkeleton || undefined}
        data-disabled={restProps.isDisabled || undefined}
        className={
          typeof rootClassName === "string" ? rootClassName : undefined
        }
      >
        {content}
      </span>
    );
  }

  return (
    <Aria.Button
      className={rootClassName}
      ref={ref}
      slot={slot}
      {...(isReadOnly === true ? { "data-readonly": true } : {})}
      {...restProps}
      aria-disabled={muted || undefined}
      inert={isSkeleton || undefined}
    >
      {content}
    </Aria.Button>
  );
});

export default Button;
