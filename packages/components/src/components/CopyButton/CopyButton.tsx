import React, { ReactNode } from "react";
import copy from "copy-to-clipboard";
import { Button, ButtonProps } from "@/components/Button";
import { IconCopy } from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { onlyText } from "react-children-utilities";
import { ClearPropsContext } from "@/lib/propsContext";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { Action } from "@/components/Action";

export interface CopyButtonProps
  extends Omit<ButtonProps, "onPress" | "aria-label">,
    FlowComponentProps {
  text: ReactNode;
}

export const CopyButton = flowComponent("CopyButton", (props) => {
  const { text, ...buttonProps } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const tooltip = stringFormatter.format("copyButton.copy");

  const copyValue = () => {
    copy(onlyText(text));
  };

  return (
    <ClearPropsContext>
      <TooltipTrigger>
        <Action action={copyValue} feedback>
          <Button aria-label={tooltip} {...buttonProps}>
            <IconCopy />
          </Button>
        </Action>
        <Tooltip>{tooltip}</Tooltip>
      </TooltipTrigger>
    </ClearPropsContext>
  );
});

export default CopyButton;
