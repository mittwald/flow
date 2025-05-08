import * as Aria from "react-aria-components";
import type { ComponentProps, FC } from "react";
import { flowComponent, type FlowComponentProps } from "@/index/internal";

export type MenuTriggerProps = ComponentProps<typeof Aria.MenuTrigger> &
  FlowComponentProps;

/** @flr-generate all */
export const MenuTrigger: FC<MenuTriggerProps> = flowComponent(
  "MenuTrigger",
  (props) => {
    return <Aria.MenuTrigger {...props} />;
  },
);

export default MenuTrigger;
