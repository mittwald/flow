import copy from "copy-to-clipboard";
import type { ButtonProps } from "@/components/Button";
import { Button } from "@/components/Button";
import { IconCopy } from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { onlyText } from "react-children-utilities";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { Action } from "@/components/Action";

export interface CopyButtonProps
  extends
    Omit<ButtonProps, "onPress" | "aria-label" | "render">,
    FlowComponentProps<HTMLButtonElement> {
  /** The text to copy. */
  text?: string;
}

/** @flr-generate all */
export const CopyButton = flowComponent("CopyButton", (props) => {
  const {
    text = "",
    ref,
    variant = "plain",
    color = "secondary",
    ...buttonProps
  } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "CopyButton");

  const tooltip = stringFormatter.format("copy");

  const copyValue = () => {
    copy(onlyText(text));
  };

  return (
    <TooltipTrigger>
      <Action onAction={copyValue} showFeedback>
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
  );
});

export default CopyButton;
