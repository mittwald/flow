import React, { type FC } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./../../locales/*.locale.json";
import { Button } from "@/components/Button";
import clsx from "clsx";

interface Props {
  isDisabled?: boolean;
  classNames?: string;
}

export const PasswordGenerateButton: FC<Props> = (props) => {
  const { classNames, isDisabled } = props;

  const translate = useLocalizedStringFormatter(locales);

  return (
    <Button
      data-component="generatePassword"
      isDisabled={isDisabled}
      className={clsx(classNames)}
      variant="plain"
      color="dark"
      size="s"
    >
      {translate.format("button.generate")}
    </Button>
  );
};
