import React, { FC, ReactNode } from "react";
import copy from "copy-to-clipboard";
import { Button, ButtonProps } from "@/components/Button";
import { IconCopy } from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { onlyText } from "react-children-utilities";
import { useProps } from "@/lib/propsContext";

export interface CopyButtonProps
  extends Omit<ButtonProps, "onPress" | "aria-label"> {
  text: ReactNode;
}

export const CopyButton: FC<CopyButtonProps> = (props) => {
  const { text, ...buttonProps } = useProps("CopyButton", props);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const tooltip = stringFormatter.format("copyButton.copy");

  const copyValue = () => {
    copy(onlyText(text));
  };

  return (
    <TooltipTrigger>
      <Button onPress={copyValue} aria-label={tooltip} {...buttonProps}>
        <IconCopy />
      </Button>
      <Tooltip>{tooltip}</Tooltip>
    </TooltipTrigger>
  );
};

export default CopyButton;
