import React, { type FC } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./../../locales/*.locale.json";
import { Button } from "@/components/Button";
import type { PropsWithClassName } from "@/lib/types/props";

interface Props extends PropsWithClassName {
  isDisabled?: boolean;
}

export const PasswordGenerateButton: FC<Props> = (props) => {
  const { className, isDisabled } = props;

  const translate = useLocalizedStringFormatter(locales);

  return (
    <Button
      data-component="generatePassword"
      isDisabled={isDisabled}
      className={className}
      variant="plain"
      color="dark"
      size="s"
    >
      {translate.format("button.generate")}
    </Button>
  );
};
