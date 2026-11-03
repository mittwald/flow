import { type FC } from "react";
import * as Aria from "react-aria-components";
import { Popover, type PopoverProps } from "@/components/Popover/Popover";
import clsx from "clsx";
import styles from "./Options.module.scss";
import type { OverlayController } from "@/lib/controller";
import type { OptionProps } from "@/components/Option";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import tokens from "@mittwald/flow-design-tokens/json-runtime/all-light.json";

/** `Popover`'s `maxHeight` is a number, so it cannot read the CSS variable. */
const maxHeight = Number.parseFloat(tokens.options["max-height"].value);

export interface OptionsProps
  extends
    Pick<Aria.ListBoxProps<OptionProps>, "renderEmptyState" | "onAction">,
    PopoverProps {
  controller: OverlayController;
}

export const Options: FC<OptionsProps> = flowComponent("Options", (props) => {
  const {
    className,
    children,
    controller,
    renderEmptyState,
    onAction,
    ...restPopoverProps
  } = props;

  const rootClassName = clsx(styles.options, className);

  return (
    <Popover
      className={styles.popover}
      controller={controller}
      maxHeight={maxHeight}
      {...restPopoverProps}
    >
      <Aria.ListBox
        onAction={onAction}
        className={rootClassName}
        renderEmptyState={renderEmptyState}
      >
        {children}
      </Aria.ListBox>
    </Popover>
  );
});

export default Options;
