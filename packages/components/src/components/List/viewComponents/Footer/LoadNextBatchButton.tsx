import type { FC } from "react";
import React from "react";
import type { ButtonProps } from "@/components/Button";
import { Button } from "@/components/Button";
import locales from "../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

type Props = Pick<ButtonProps, "isDisabled" | "isPending" | "onPress">;

export const LoadNextBatchButton: FC<Props> = (props) => {
  const stringFormatter = useLocalizedStringFormatter(locales);

  return (
    <Button {...props} variant="plain" size="s">
      {stringFormatter.format("list.showMore")}
    </Button>
  );
};

export default LoadNextBatchButton;
