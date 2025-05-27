import React, { type FC } from "react";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import Button from "@/components/Button";
import { IconHide, IconShow } from "@/components/Icon/components/icons";
import { Action, type ActionFn } from "@/components/Action";
import locales from "./../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

interface Props {
  isDisabled?: boolean;
  isVisible: boolean;
  onPress: ActionFn;
}

/** @internal */
export const TogglePasswordVisibilityButton: FC<Props> = ({
  isVisible,
  isDisabled = false,
  onPress,
}) => {
  const translate = useLocalizedStringFormatter(locales);

  const icon = isVisible ? <IconHide /> : <IconShow />;
  const tooltipText = translate.format(
    "button.generate.tooltip." + (isVisible ? "hide" : "show"),
  );

  return (
    <Action action={onPress}>
      <TooltipTrigger>
        <Button
          size="m"
          variant="plain"
          color="secondary"
          isDisabled={isDisabled}
          data-component="toggleRevealPassword"
        >
          {icon}
          <Tooltip>{tooltipText}</Tooltip>
        </Button>
      </TooltipTrigger>
    </Action>
  );
};

export default TogglePasswordVisibilityButton;
