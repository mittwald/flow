import { type FC } from "react";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider/useLocalizedStringFormatter";
import locales from "./../../locales/*.locale.json";
import { Button } from "@/components/Button";
import { Action, type ActionFn } from "@/components/Action";

interface Props {
  isDisabled?: boolean;
  onGeneratePasswordAction?: ActionFn;
}

export const PasswordGenerateButton: FC<Props> = (props) => {
  const { isDisabled, onGeneratePasswordAction } = props;
  const translate = useLocalizedStringFormatter(
    locales,
    "PasswordCreationField",
  );

  return (
    <Action onAction={onGeneratePasswordAction} showFeedback={false}>
      <Button
        data-component="generatePassword"
        isDisabled={isDisabled}
        variant="plain"
        color="secondary"
        // The button sits in the label, where "Generate" alone does not say
        // what is generated.
        aria-label={translate.format("button.generate.label")}
      >
        {translate.format("button.generate")}
      </Button>
    </Action>
  );
};
