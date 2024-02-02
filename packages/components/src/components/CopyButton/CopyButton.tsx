import React, { FC, ReactNode } from "react";
import copy from "copy-to-clipboard";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { faCopy } from "@fortawesome/free-regular-svg-icons/faCopy";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { onlyText } from "react-children-utilities";

export interface CopyButtonProps {
  value: ReactNode;
  className?: string;
}

export const CopyButton: FC<CopyButtonProps> = (props) => {
  const { value, className } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const tooltip = stringFormatter.format("copyButton.copy");

  const copyValue = () => {
    copy(onlyText(value));
  };

  return (
    <TooltipTrigger>
      <Button
        className={className}
        onPress={copyValue}
        aria-label={tooltip}
        variant="plain"
        small
      >
        <Icon faIcon={faCopy} />
      </Button>
      <Tooltip>{tooltip}</Tooltip>
    </TooltipTrigger>
  );
};

export default CopyButton;
