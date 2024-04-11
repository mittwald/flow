import type { ReactNode } from "react";
import React from "react";
import copy from "copy-to-clipboard";
import type { ButtonProps } from "@/components/Button";
import { Button } from "@/components/Button";
import { IconCopy } from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { onlyText } from "react-children-utilities";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Action } from "@/components/Action";

export interface CopyButtonProps
  extends Omit<ButtonProps, "onPress" | "aria-label">,
    FlowComponentProps {
  text: ReactNode;
}

export const CopyButton = flowComponent("CopyButton", (props) => {
  const { text, ref, ...buttonProps } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  const tooltip = stringFormatter.format("copyButton.copy");

  const copyValue = () => {
    copy(onlyText(text));
  };

  return (
    <ClearPropsContext>
      <TooltipTrigger>
        <Action action={copyValue} feedback>
          <Button aria-label={tooltip} {...buttonProps} ref={ref}>
            <IconCopy />
          </Button>
        </Action>
        <Tooltip>{tooltip}</Tooltip>
      </TooltipTrigger>
    </ClearPropsContext>
  );
});

export default CopyButton;
