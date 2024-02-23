import React, { FC, ReactNode } from "react";
import copy from "copy-to-clipboard";
import { Button, ButtonProps } from "@/components/Button";
import { Icon } from "@/components/Icon";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { onlyText } from "react-children-utilities";
import { useProps } from "@/lib/propsContext";
import { IconCopy } from "@tabler/icons-react";

export interface CopyToClipboardButtonProps
  extends Omit<ButtonProps, "onPress" | "aria-label"> {
  text: ReactNode;
}

export const CopyToClipboardButton: FC<CopyToClipboardButtonProps> = (
  props,
) => {
  const { text, ...buttonProps } = useProps("CopyToClipboard", props);

  const stringFormatter = useLocalizedStringFormatter(locales);

  const tooltip = stringFormatter.format("copyButton.copy");

  const copyValue = () => {
    copy(onlyText(text));
  };

  return (
    <TooltipTrigger>
      <Button onPress={copyValue} aria-label={tooltip} {...buttonProps}>
        <Icon tablerIcon={<IconCopy />} />
      </Button>
      <Tooltip>{tooltip}</Tooltip>
    </TooltipTrigger>
  );
};

export default CopyToClipboardButton;
