import type { FC } from "react";
import React from "react";
import { Text } from "@/components/Text";
import { IconCircleCheck, IconCircleMinus } from "@tabler/icons-react";
import generateValidationTranslation from "@/components/PasswordCreationField/lib/generateValidationTranslation";
import locales from "./../../locales/*.locale.json";
import styles from "./ValidationResultEntry.module.scss";
import type { RuleValidationResult } from "@/integrations/@mittwald/password-tools-js";
import { useLocalizedContextStringFormatter } from "@/components/TranslationProvider/useLocalizedContextStringFormatter";

interface Props {
  result: RuleValidationResult;
}

/** @internal */
export const ValidationResultEntry: FC<Props> = (props) => {
  const { result } = props;
  const translate = useLocalizedContextStringFormatter(locales);

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
      className={styles.validationResultEntry}
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
