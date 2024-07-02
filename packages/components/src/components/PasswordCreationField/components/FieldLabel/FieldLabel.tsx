import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Button } from "@/components/Button";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import styles from "./FieldLabel.module.scss";
import type { ActionFn } from "@/components/Action";
import { Action } from "@/components/Action";
import { IconCircleCheck, IconCircleMinus } from "@tabler/icons-react";
import type { LocalizedStrings } from "react-aria";
import { useLocalizedStringFormatter } from "react-aria";
import { type RuleValidationResult } from "@mittwald/password-validation/rules";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import type * as Aria from "react-aria-components";

export type PasswordFieldLabelProps = PropsWithChildren<{
  ruleValidationResult?: RuleValidationResult[];
  onGeneratePasswordAction: ActionFn;
  locales?: LocalizedStrings;
  value?: string;
}> &
  Pick<Aria.InputProps, "disabled">;

export const FieldLabel: FC<PasswordFieldLabelProps> = (props) => {
  const {
    children,
    onGeneratePasswordAction,
    ruleValidationResult,
    disabled,
    value,
    locales = {},
  } = props;
  const translate = useLocalizedStringFormatter(locales);

  const validationResultComponents = ruleValidationResult
    ?.filter((r) => {
      return !value ? !r.isValid : true;
    })
    .map((r) => {
      const icon = r.isValid ? (
        <IconCircleCheck color="green" />
      ) : (
        <IconCircleMinus color="red" />
      );

      const [translationKey, translationValues] =
        generateValidationTranslation(r);

      return (
        <Text key={translationKey} className={styles.rule}>
          {icon}
          {translate.format(translationKey, translationValues)}
        </Text>
      );
    });

  return (
    <>
      {children}
      <div className={styles.passwordFieldLabel}>
        <ContextualHelpTrigger>
          <Button
            data-component="showPasswordRules"
            isDisabled={disabled}
            className={styles.helpButton}
          />
          <ContextualHelp>
            <Heading>
              {translate.format("password.requirements.heading")}
            </Heading>
            {validationResultComponents}
          </ContextualHelp>
        </ContextualHelpTrigger>
        {onGeneratePasswordAction && (
          <Action action={onGeneratePasswordAction}>
            <Button
              data-component="generatePassword"
              isDisabled={disabled}
              className={styles.generateButton}
              variant="plain"
              color="dark"
              size="s"
            >
              {translate.format("button.generate")}
            </Button>
          </Action>
        )}
      </div>
    </>
  );
};

export default FieldLabel;
