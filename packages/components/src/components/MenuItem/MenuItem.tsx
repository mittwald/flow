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
  extends Omit<Aria.MenuItemProps, "children">,
    PropsWithChildren,
    FlowComponentProps {
  selectionVariant?: "control" | "navigation" | "switch";
  /** Whether the button is in a pending state. */
  isPending?: boolean;
  /** Whether the button is in a succeeded state. */
  isSucceeded?: boolean;
  /** Whether the button is in a failed state. */
  isFailed?: boolean;
}

/** @flr-generate all */
export const MenuItem = flowComponent("MenuItem", (props) => {
  const {
    children,
    className,
    selectionVariant,
    id,
    ref,
    isDisabled,
    isPending,
    isSucceeded,
    isFailed,
    ...rest
  } = props;

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

  const StateIconComponent = isSucceeded
    ? IconSucceeded
    : isFailed
      ? IconFailed
      : isPending
        ? LoadingSpinner
        : undefined;

  const stateIcon = StateIconComponent && (
    <div className={styles.stateIcon}>
      <StateIconComponent
        status={isFailed ? "danger" : isSucceeded ? "success" : undefined}
      />
    </div>
  );

  return (
    <Aria.MenuItem
      {...rest}
      key={id}
      id={id}
      className={rootClassName}
      ref={ref}
      isDisabled={isDisabled || isPending || isSucceeded || isFailed}
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
