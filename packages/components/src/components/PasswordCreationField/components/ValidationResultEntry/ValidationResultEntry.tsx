import type { FC } from "react";
import React from "react";
import { Text } from "@/components/Text";
import { IconCircleCheck, IconCircleMinus } from "@tabler/icons-react";
import { useLocalizedStringFormatter } from "react-aria";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import locales from "./../../locales/*.locale.json";
import styles from "./ValidationResultEntry.module.scss";
import type { RuleValidationResult } from "@mittwald/password-tools-js/rules";

export interface ValidationResultEntryProps {
  result: RuleValidationResult;
}

/** @internal */
export const ValidationResultEntry: FC<ValidationResultEntryProps> = (
  props,
) => {
  const { result } = props;
  const translate = useLocalizedStringFormatter(locales);

  const icon = result.isValid ? (
    <IconCircleCheck color="green" />
  ) : (
    <IconCircleMinus color="red" />
  );

  const [translationKey, translationValues] = generateValidationTranslation(
    result,
    true,
  );

  return (
    <Text
      className={styles.rule}
      data-rule={result.ruleType}
      data-rule-valid={result.isValid}
      key={translationKey}
    >
      {icon}
      {translate.format(translationKey, translationValues)}
    </Text>
  );
};

export default ValidationResultEntry;
