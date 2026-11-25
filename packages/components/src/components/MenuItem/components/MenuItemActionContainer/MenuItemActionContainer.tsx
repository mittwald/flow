import {
  type FC,
  type KeyboardEvent,
  type PropsWithChildren,
  type SyntheticEvent,
  useEffect,
  useRef,
} from "react";
import { useLocale } from "react-aria";
import styles from "../../MenuItem.module.scss";

/**
 * The item clicks itself on a `pointerup` it did not see start, and its
 * `onClick` runs the menu's `onAction`. Neither event may reach it.
 */
const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

/** Wraps an `ItemAction` inside a menu item, via the item's PropsContext. */
export const MenuItemActionContainer: FC<PropsWithChildren> = (props) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const { direction } = useLocale();
  const forwardKey = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
  const backKey = direction === "rtl" ? "ArrowRight" : "ArrowLeft";

  /** Arrow keys move the focus between the item and its action. */
  useEffect(() => {
    const container = containerRef.current;
    const menuItem = container?.closest<HTMLElement>('[role^="menuitem"]');
    const button = container?.querySelector("button");
    if (!menuItem || !button || menuItem.hasAttribute("aria-haspopup")) {
      return;
    }

    const focusAction = (e: globalThis.KeyboardEvent) => {
      if (e.target === menuItem && e.key === forwardKey) {
        e.preventDefault();
        button.focus();
      }
    };

    menuItem.addEventListener("keydown", focusAction);
    return () => menuItem.removeEventListener("keydown", focusAction);
  }, [forwardKey]);

  const focusMenuItem = (e: KeyboardEvent<HTMLSpanElement>) => {
    const menuItem = e.currentTarget.closest<HTMLElement>('[role^="menuitem"]');
    if (e.key === backKey && menuItem) {
      e.preventDefault();
      e.stopPropagation();
      menuItem.focus();
    }
  };

  return (
    <span
      ref={containerRef}
      className={styles.menuItemAction}
      onPointerUp={stopPropagation}
      onClick={stopPropagation}
      onKeyDown={focusMenuItem}
    >
      {props.children}
    </span>
  );
};

export default MenuItemActionContainer;
