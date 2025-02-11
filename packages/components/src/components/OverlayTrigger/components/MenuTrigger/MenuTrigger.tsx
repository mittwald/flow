import * as Aria from "react-aria-components";
import type { ComponentProps, FC } from "react";

export type MenuTriggerProps = ComponentProps<typeof Aria.MenuTrigger>;

/** @flr-generate all */
export const MenuTrigger: FC<MenuTriggerProps> = (props) => {
  return <Aria.MenuTrigger {...props} />;
};

export default MenuTrigger;
