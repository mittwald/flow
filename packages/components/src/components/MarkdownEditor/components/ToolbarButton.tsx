import React, { type FC } from "react";
import { type InsertType } from "@/components/MarkdownEditor/lib/modifyValueByType";
import { Button, type ButtonProps } from "@/components/Button";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "../locales/*.locale.json";

export interface ToolBarButtonProps extends Pick<
  ButtonProps,
  "isDisabled" | "children"
> {
  type: InsertType;
  onPress?: (type: InsertType) => void;
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
      data-button-type={type}
      aria-label={stringFormatter.format(`toolbar.${type}`)}
      size="s"
      variant="plain"
      color="dark"
      onPress={() => onPress?.(type)}
    >
      {children}
    </Button>
  );
};
