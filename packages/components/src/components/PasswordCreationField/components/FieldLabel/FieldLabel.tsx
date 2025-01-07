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
import { useLocalizedStringFormatter } from "react-aria";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import type * as Aria from "react-aria-components";
import type { ResolvedPolicyValidationResult } from "@/components/PasswordCreationField/PasswordCreationField";
import { isCryptographicSecureRandom } from "@mittwald/password-tools-js/generator";
import locales from "./../../locales/*.locale.json";

export type PasswordFieldLabelProps = PropsWithChildren<{
  policyValidationResult?: ResolvedPolicyValidationResult;
  onGeneratePasswordAction?: ActionFn;
}> &
  Pick<Aria.InputProps, "disabled">;

/**
 * @class
 * @param props
 * @internal
 */
export const FieldLabel: FC<PasswordFieldLabelProps> = (props) => {
  const {
    children,
    onGeneratePasswordAction,
    policyValidationResult,
    disabled,
  } = props;
  const translate = useLocalizedStringFormatter(locales);

  const validationResultComponents = policyValidationResult?.ruleResults
    ?.filter((r) => {
      return policyValidationResult?.isEmptyValueValidation ? !r.isValid : true;
    })
    .map((r) => {
      const icon = r.isValid ? (
        <IconCircleCheck color="green" />
      ) : (
        <IconCircleMinus color="red" />
      );

      const [translationKey, translationValues] = generateValidationTranslation(
        r,
        true,
      );

      return (
        <Text
          className={styles.rule}
          data-rule={r.ruleType}
          data-rule-valid={r.isValid}
          key={translationKey}
        >
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
        {onGeneratePasswordAction && isCryptographicSecureRandom && (
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
