import { type FC } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./../../locales/*.locale.json";
import { Button } from "@/components/Button";
import type { PropsWithClassName } from "@/lib/types/props";
import { Action, type ActionFn } from "@/components/Action";

interface Props extends PropsWithClassName {
  isDisabled?: boolean;
  onGeneratePasswordAction?: ActionFn;
}

export const PasswordGenerateButton: FC<Props> = (props) => {
  const { className, isDisabled, onGeneratePasswordAction } = props;
  const translate = useLocalizedStringFormatter(locales);

  return (
    <Action action={onGeneratePasswordAction}>
      <Button
        data-component="generatePassword"
        isDisabled={isDisabled}
        className={className}
        variant="plain"
        color="dark"
      >
        {translate.format("button.generate")}
      </Button>
    </Action>
  );
};
