import { type FC } from "react";
import { type InsertType } from "@/components/MarkdownEditor/lib/modifyValueByType";
import { Button, type ButtonProps } from "@/components/Button";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../locales/*.locale.json";

/**
 * What a toolbar button is: every markdown syntax it inserts, plus the one tool
 * that does something else. The name is also the `toolbar.<type>` locale key of
 * the button's label.
 */
export type ToolbarButtonType = InsertType | "attachment";

export interface ToolBarButtonProps extends Pick<
  ButtonProps,
  "isDisabled" | "children"
> {
  type: ToolbarButtonType;
  onPress?: () => void;
}

export const ToolbarButton: FC<ToolBarButtonProps> = (props) => {
  const { children, type, onPress, ...rest } = props;

  const stringFormatter = useLocalizedStringFormatter(
    locales,
    "MarkdownEditor",
  );

  return (
    <Button
      {...rest}
      tunnel={null}
      data-button-type={type}
      aria-label={stringFormatter.format(`toolbar.${type}`)}
      size="s"
      variant="plain"
      color="dark"
      onPress={onPress}
    >
      {children}
    </Button>
  );
};
