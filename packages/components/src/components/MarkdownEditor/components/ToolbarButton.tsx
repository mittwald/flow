import React, { type FC } from "react";
import { type InsertType } from "@/components/MarkdownEditor/lib/insertAtCursor";
import { Button, type ButtonProps } from "@/components/Button";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "../locales/*.locale.json";

export interface ToolBarButtonProps
  extends Pick<ButtonProps, "isDisabled" | "children"> {
  type: InsertType;
  onToolPressed?: (type: InsertType) => void;
}

export const ToolbarButton: FC<ToolBarButtonProps> = (props) => {
  const { children, type, onToolPressed, ...rest } = props;

  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Button
      {...rest}
      aria-label={stringFormatter.format(`toolbar.${type}`)}
      size="s"
      variant="plain"
      color="dark"
      onPress={() => onToolPressed?.(type)}
    >
      {children}
    </Button>
  );
};
