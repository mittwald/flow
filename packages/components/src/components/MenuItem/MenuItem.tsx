import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./MenuItem.module.scss";
import clsx from "clsx";
import { MenuItemContent } from "@/components/MenuItem/components/MenuItemContent/MenuItemContent";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useAriaAnnounceActionState } from "@/components/Action/lib/ariaLive";
import { IconFailed, IconSucceeded } from "@/components/Icon/components/icons";
import LoadingSpinner from "@/components/LoadingSpinner";

export interface MenuItemProps
  extends
    Omit<Aria.MenuItemProps, "children">,
    PropsWithChildren,
    FlowComponentProps {
  selectionVariant?: "control" | "navigation" | "switch";
  /** Whether the button is in a pending state. */
  isPending?: boolean;
  /** Whether the button is in a succeeded state. */
  isSucceeded?: boolean;
  /** Whether the button is in a failed state. */
  isFailed?: boolean;
  /** Disables button but keeps it focusable. */
  "aria-disabled"?: boolean;
  /** Marks the menu item as referring to the currently active page. */
  "aria-current"?: string;
}

const disablePendingProps = (props: MenuItemProps) => {
  if (
    props.isPending ||
    props.isSucceeded ||
    props.isFailed ||
    props["aria-disabled"]
  ) {
    props = { ...props };
    props.onPress = undefined;
    props.onPressStart = undefined;
    props.onPressEnd = undefined;
    props.onPressChange = undefined;
    props.onPressUp = undefined;
  }

  return props;
};

/** @flr-generate all */
export const MenuItem = flowComponent("MenuItem", (props) => {
  props = disablePendingProps(props);

  const {
    children,
    className,
    selectionVariant,
    id,
    ref,
    "aria-disabled": ariaDisabled,
    "aria-current": ariaCurrent,
    isPending,
    isSucceeded,
    isFailed,
    ...rest
  } = props;

  /**
   * React Aria drops `aria-current` from the props it forwards to the DOM, so
   * the current state is exposed as a data attribute (`data-*` passes the
   * filter) — that is what the `menuItem` styling matches on. Every
   * `aria-current` value marks the item as current, except an explicit
   * "false".
   */
  const currentProps =
    ariaCurrent && ariaCurrent !== "false" ? { "data-current": true } : {};

  const rootClassName = clsx(
    styles.menuItem /**
     * Workaround warning: The Aria.MenuItem does not support "aria-disabled" by
     * now, so this MenuItem will be visually disabled via CSS.
     */,
    (ariaDisabled || isFailed || isSucceeded || isPending) &&
      styles.ariaDisabled,
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

  const stateIconElement = isSucceeded ? (
    <IconSucceeded color="success" />
  ) : isFailed ? (
    <IconFailed color="danger" />
  ) : isPending ? (
    <LoadingSpinner />
  ) : undefined;

  const stateIcon = stateIconElement && (
    <div className={styles.stateIcon}>{stateIconElement}</div>
  );

  return (
    <Aria.MenuItem
      {...rest}
      {...currentProps}
      key={id}
      id={id}
      className={rootClassName}
      ref={ref}
    >
      {(props) => (
        <>
          <MenuItemContent {...props} selectionVariant={selectionVariant}>
            {children}
          </MenuItemContent>
          {stateIcon}
        </>
      )}
    </Aria.MenuItem>
  );
});

export default MenuItem;
