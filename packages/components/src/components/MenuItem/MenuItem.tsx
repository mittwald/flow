import type { KeyboardEvent, MouseEvent, PropsWithChildren } from "react";
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
  /**
   * Shows the checkbox of a multiple-selection item as partially checked,
   * unless the item is selected.
   */
  isIndeterminate?: boolean;
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

const isMuted = (props: MenuItemProps) =>
  !!(
    props.isPending ||
    props.isSucceeded ||
    props.isFailed ||
    props["aria-disabled"]
  );

type RenderFunction = NonNullable<MenuItemProps["render"]>;

const renderElement: RenderFunction = (domProps) =>
  "href" in domProps ? <a {...domProps} /> : <div {...domProps} />;

/**
 * React Aria drops `aria-disabled` from the props it forwards to the DOM, so it
 * is added to the rendered element. Its `onClick` runs the menu's `onAction`,
 * follows the link and toggles the selection, and Enter and Space toggle the
 * selection on key down, so both handlers are replaced as well.
 */
const renderMuted =
  (render: RenderFunction = renderElement): RenderFunction =>
  (domProps, renderProps) =>
    render(
      {
        ...domProps,
        "aria-disabled": true,
        onClick: (e: MouseEvent) => e.preventDefault(),
        onKeyDown: (e: KeyboardEvent<HTMLDivElement & HTMLAnchorElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          } else {
            domProps.onKeyDown?.(e);
          }
        },
      },
      renderProps,
    );

const disablePendingProps = (props: MenuItemProps) => {
  if (isMuted(props)) {
    props = { ...props };
    props.onAction = undefined;
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
  const muted = isMuted(props);
  props = disablePendingProps(props);

  const {
    children,
    className,
    selectionVariant,
    isIndeterminate,
    id,
    ref,
    "aria-disabled": ignoredAriaDisabled,
    "aria-current": ariaCurrent,
    render,
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

  const rootClassName = clsx(styles.menuItem, className);

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
      render={muted ? renderMuted(render) : render}
      key={id}
      id={id}
      className={rootClassName}
      ref={ref}
    >
      {(props) => (
        <>
          <MenuItemContent
            {...props}
            selectionVariant={selectionVariant}
            isIndeterminate={isIndeterminate}
          >
            {children}
          </MenuItemContent>
          {stateIcon}
        </>
      )}
    </Aria.MenuItem>
  );
});

export default MenuItem;
