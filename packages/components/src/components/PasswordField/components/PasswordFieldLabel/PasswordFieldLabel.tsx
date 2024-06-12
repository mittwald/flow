import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Button } from "@/components/Button";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import styles from "./PasswordFieldLabel.module.scss";
import type { ActionFn } from "@/components/Action";
import { Action } from "@/components/Action";
import { IconCircleCheck, IconCircleMinus } from "@tabler/icons-react";
import { Translate } from "@/lib/react/components/Translate";
import locales from "./../../locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export type PasswordFieldLabelProps = PropsWithChildren<{
  policyRuleResults?: any[];
  onGeneratePasswordAction: ActionFn;
}>;

export const PasswordFieldLabel: FC<PasswordFieldLabelProps> = (props) => {
  const { children, onGeneratePasswordAction, policyRuleResults } = props;
  const translate = useLocalizedStringFormatter(locales);

  const rules = policyRuleResults?.map((r) => {
    const icon = r.isValid ? (
      <IconCircleCheck color="green" />
    ) : (
      <IconCircleMinus color="red" />
    );

    console.log(r);

    return (
      <Text className={styles.rule}>
        {icon}
        {translate.format(`validation_${r.ruleType}`, { count: r.min })}
      </Text>
    );
  });

  return (
    <>
      {children}
      <div className={styles.passwordFieldLabel}>
        <ContextualHelpTrigger>
          <Button className={styles.helpButton} />
          <ContextualHelp>
            <Heading>Dein Passwort muss enthalten:</Heading>
            {rules}
          </ContextualHelp>
        </ContextualHelpTrigger>
        {onGeneratePasswordAction && (
          <Action action={onGeneratePasswordAction}>
            <Button
              className={styles.generateButton}
              variant="plain"
              color="dark"
              size="s"
            >
              Generieren
            </Button>
          </Action>
        )}
      </div>
    </>
  );
};

export default PasswordFieldLabel;
