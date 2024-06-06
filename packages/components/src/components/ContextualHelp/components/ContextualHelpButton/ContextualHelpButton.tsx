import type { FC } from "react";
import React from "react";
import type { ButtonProps } from "@/components/Button";
import { Button } from "@/components/Button";
import { IconInfo } from "@/components/Icon/components/icons";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export type ContextualHelpButtonProps = Omit<
  ButtonProps,
  "size" | "variant" | "color" | "children" | "aria-label"
>;
export const ContextualHelpButton: FC<ContextualHelpButtonProps> = (props) => {
  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Button
      aria-label={stringFormatter.format(
        "contextualHelpButton.moreInformation",
      )}
      size="s"
      variant="plain"
      {...props}
    >
      <IconInfo />
    </Button>
  );
};
