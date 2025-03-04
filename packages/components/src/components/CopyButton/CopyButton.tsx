import { Action } from "@/components/Action";
import type { ButtonProps } from "@/components/Button";
import { Button } from "@/components/Button";
import { IconCopy } from "@/components/Icon/components/icons";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import copy from "copy-to-clipboard";
import type { ReactNode } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import { onlyText } from "react-children-utilities";
import locales from "./locales/*.locale.json";

export interface CopyButtonProps
  extends Omit<ButtonProps, "onPress" | "aria-label" | "render">,
    FlowComponentProps {
  /** The text to copy. */
  text: ReactNode;
}

/** @flr-generate all */
export const CopyButton = flowComponent<"CopyButton", HTMLButtonElement>(
  "CopyButton",
  (props) => {
    const {
      text,
      ref,
      variant = "plain",
      color = "secondary",
      ...buttonProps
    } = props;

    const stringFormatter = useLocalizedStringFormatter(locales);

    const tooltip = stringFormatter.format("copyButton.copy");

    const copyValue = () => {
      copy(onlyText(text));
    };

    return (
      <ClearPropsContextView>
        <TooltipTrigger>
          <Action action={copyValue} showFeedback>
            <Button
              aria-label={tooltip}
              {...buttonProps}
              ref={ref}
              variant={variant}
              color={color}
            >
              <IconCopy />
            </Button>
          </Action>
          <Tooltip>{tooltip}</Tooltip>
        </TooltipTrigger>
      </ClearPropsContextView>
    );
  },
);

export default CopyButton;
