import * as R from "remeda";
import { AriaMenuItemProps, MenuItemAria, useMenuItem } from "react-aria";
import { TreeState } from "react-stately";
import { RefObject } from "react";
import { FocusableElement } from "@react-types/shared";

export const useNavigationItem = <T = never>(
  props: AriaMenuItemProps,
  state: TreeState<T>,
  ref: RefObject<FocusableElement>,
): MenuItemAria => {
  const menuItem = useMenuItem(props, state, ref);

  /**
   * The props of `useMenuItem` include `role="menuitem"` what conflicts with
   * the desired navigation pattern. So the `role` prop is omitted in this
   * case.
   *
   * For more details see this document:
   * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
   */
  menuItem.menuItemProps = R.omit(menuItem.menuItemProps, ["role"]);

  return menuItem;
};
