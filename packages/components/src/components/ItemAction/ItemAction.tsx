import clsx from "clsx";
import styles from "./ItemAction.module.scss";
import { Button, type ButtonProps } from "@/components/Button";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface ItemActionProps
  extends
    Omit<
      ButtonProps,
      | "color"
      | "variant"
      | "size"
      | "slot"
      | "unstyled"
      | "ariaSlot"
      | "elementType"
    >,
    FlowComponentProps<HTMLButtonElement> {
  /**
   * When the action is visible. `hover` shows it while the item is hovered or
   * focused, and always on devices with a touchscreen.
   *
   * @default "hover"
   */
  visibility?: "hover" | "always";
}

/**
 * @flr-generate all
 * @flowStatus beta, new
 */
export const ItemAction = flowComponent("ItemAction", (props) => {
  const { visibility = "hover", className, ref, ...rest } = props;

  return (
    <span
      className={clsx(styles.itemAction, className)}
      data-visibility={visibility}
    >
      <Button {...rest} ref={ref} variant="plain" color="secondary" size="s" />
    </span>
  );
});

export default ItemAction;
