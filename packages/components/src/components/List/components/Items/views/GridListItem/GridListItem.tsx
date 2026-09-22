import * as Aria from "react-aria-components";
import type { FC } from "react";
import styles from "@/components/List/components/Items/components/Item/Item.module.scss";
import clsx from "clsx";
import { useLinkProps } from "@react-aria/utils";

export type GridListItemProps = Aria.GridListItemProps<never> & {
  hasAction?: boolean;
  isTile?: boolean;
};

/** @flr-generate all */
export const GridListItem: FC<GridListItemProps> = (props) => {
  const { hasAction, isTile, children, ...restProps } = props;

  // React Aria turns `href` into data attributes and navigates on press, so
  // the row itself is always a `div`. Overlay a real anchor to give the browser
  // back its own link affordances: context menu, middle-click, modifier-click.
  const linkProps = useLinkProps(props);

  const linkOverlay = linkProps.href ? (
    // The row keeps owning activation and the accessible semantics. The anchor
    // must stay untabbable — React Aria treats a tabbable descendant as
    // interactive content and would stop the row's own press — and out of the
    // accessibility tree, so screen readers announce the row unchanged.
    <a
      {...linkProps}
      aria-hidden
      className={styles.link}
      draggable={false}
      tabIndex={-1}
    />
  ) : null;

  return (
    <Aria.GridListItem
      {...restProps}
      className={(renderProps) =>
        clsx(
          styles.item,
          hasAction && styles.hasAction,
          isTile && styles.tile,
          renderProps.isSelected && styles.isSelected,
        )
      }
    >
      {(renderProps) => (
        <>
          {typeof children === "function" ? children(renderProps) : children}
          {linkOverlay}
        </>
      )}
    </Aria.GridListItem>
  );
};

export default GridListItem;
