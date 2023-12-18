import * as R from "remeda";
import { AriaMenuOptions, useMenu } from "react-aria";
import { TreeState } from "react-stately";
import { RefObject } from "react";

export const useNavigation = <T = never>(
  opts: AriaMenuOptions<T>,
  state: TreeState<T>,
  ref: RefObject<HTMLElement>,
) => {
  const menu = useMenu(opts, state, ref);

  /**
   * The props of `useMenu` include `role="menu"` what conflicts with the
   * desired navigation pattern. So the `role` prop is omitted in this case.
   *
   * For more details see this document:
   * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
   */
  menu.menuProps = R.omit(menu.menuProps, ["role"]);

  return menu;
};
